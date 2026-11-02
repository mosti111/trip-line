import { readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const modulePath = fileURLToPath(import.meta.url);
const defaultRoot = path.resolve(path.dirname(modulePath), '../..');
export const transitions = Object.freeze({
  PLANNED: ['READY', 'BLOCKED'],
  READY: ['IN_PROGRESS', 'BLOCKED'],
  IN_PROGRESS: ['IMPLEMENTED', 'BLOCKED'],
  BLOCKED: ['READY', 'IN_PROGRESS'],
  IMPLEMENTED: ['REVIEW_REQUIRED', 'BLOCKED'],
  REVIEW_REQUIRED: ['REVIEWING', 'BLOCKED'],
  REVIEWING: ['APPROVED', 'CHANGES_REQUESTED', 'BLOCKED'],
  CHANGES_REQUESTED: ['READY', 'IN_PROGRESS', 'BLOCKED'],
  APPROVED: ['CHANGES_REQUESTED'],
});
const kinds = new Set(['documentation', 'frontend', 'verification', 'integration']);
const evidenceKinds = new Set(['automated', 'rendered', 'scope', 'routing', 'other']);
const evidenceResults = new Set(['PASS', 'FAIL', 'GAP']);
const reviewResults = new Set(['PASS', 'FAIL', 'PASS WITH FOLLOW-UP']);
const dispatchedStates = new Set([
  'IN_PROGRESS', 'IMPLEMENTED', 'REVIEW_REQUIRED', 'REVIEWING', 'APPROVED',
]);
const deliveredStates = new Set([
  'IMPLEMENTED', 'REVIEW_REQUIRED', 'REVIEWING', 'APPROVED', 'CHANGES_REQUESTED',
]);
const passingReview = review => record(review)
  && ['PASS', 'PASS WITH FOLLOW-UP'].includes(review.result);
const boundedLabel = value => text(value) && value === value.trim()
  && /^[\p{L}\p{N}][\p{L}\p{N} /_-]*$/u.test(value)
  && !/(?:^|[ /_-])(all|any|every|everything|everywhere|unbounded|unlimited|entire|wildcard)(?:$|[ /_-])/i.test(value);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const utcTime = value => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  && Number.isFinite(Date.parse(value))
  && new Date(value).toISOString() === value.replace(/Z$/, value.includes('.') ? 'Z' : '.000Z');
const within = (root, target) => {
  const relative = path.relative(root, target);
  return relative === '' || (!path.isAbsolute(relative)
    && relative !== '..' && !relative.startsWith(`..${path.sep}`));
};

// Reject aliases, including internal symlinks/junctions and ancestors of new files.
// io is injectable only for synthetic resolver regression tests; CLI uses Node fs.
// No writes, processes or worker dispatch occur.
function filesystemProbe(root, relative, io = { realpathSync, statSync }) {
  const target = path.resolve(root, relative);
  let ancestor = target;
  while (true) {
    try {
      const resolved = io.realpathSync(ancestor);
      if (!within(root, resolved)) return { inside: false, exists: false, file: false };
      if (path.relative(ancestor, resolved) !== '') {
        return { inside: true, canonical: false, exists: false, file: false };
      }
      break;
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
      const parent = path.dirname(ancestor);
      if (parent === ancestor) return { inside: false, exists: false, file: false };
      ancestor = parent;
    }
  }
  try {
    return { inside: true, canonical: true, exists: true, file: io.statSync(target).isFile() };
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) {
      return { inside: true, canonical: true, exists: false, file: false };
    }
    throw error;
  }
}

/** Read-only structural validation. inspectPath is injectable for in-memory tests.
 * It is not an evidence attestation interface; production CLI uses the filesystem.
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateState(state, options = {}) {
  const errors = [];
  const fail = (label, message) => errors.push(`${label}: ${message}`);
  let root;
  try { root = realpathSync(options.repoRoot ?? defaultRoot); }
  catch { return { valid: false, errors: ['repository root does not exist'] }; }
  const now = new Date(options.now ?? Date.now()).getTime();
  if (!Number.isFinite(now)) return { valid: false, errors: ['invalid validation time'] };
  const probe = options.inspectPath ?? (relative => filesystemProbe(root, relative));
  const requiredText = (object, field, label) => {
    if (!text(object[field])) fail(label, `${field} must be a nonempty string`);
  };
  function checkPath(value, label, required = true, explicitNewFile = false) {
    if (!text(value) || value !== value.trim() || value.includes('\\')
      || /[\x00-\x1f<>:"|?*]/.test(value) || value.startsWith('/')
      || value.split('/').some(part => !part || part === '.' || part === '..'
        || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))
      || path.isAbsolute(value) || !within(root, path.resolve(root, value))) {
      fail(label, 'must be a safe exact repository-relative file path');
      return false;
    }
    try {
      const info = probe(value);
      if (!info.inside) fail(label, 'resolved path escapes repository');
      else if (info.canonical === false) fail(label, 'noncanonical filesystem alias is forbidden');
      else if (info.exists && !info.file) fail(label, 'path must name a file, not a directory');
      else if (required && !info.exists) fail(label, `referenced file does not exist: ${value}`);
      else if (explicitNewFile && !info.exists && !path.posix.basename(value).includes('.')) {
        fail(label, 'new path must have an explicit file name; ambiguous extensionless scope is forbidden');
      }
      else return true;
    } catch (error) { fail(label, `cannot inspect path: ${error.message}`); }
    return false;
  }
  function history(item, label) {
    if (!Array.isArray(item.history) || item.history.length === 0) {
      fail(label, 'history must be a nonempty array');
      return;
    }
    let previous = null;
    let previousTime = -Infinity;
    item.history.forEach((event, index) => {
      const at = `${label}.history[${index}]`;
      if (!record(event)) { fail(at, 'must be an object'); return; }
      for (const field of ['actor', 'reason']) requiredText(event, field, at);
      if (!utcTime(event.at)) fail(at, 'at must be an ISO UTC timestamp');
      else if (Date.parse(event.at) < previousTime) fail(at, 'history is not chronological');
      else previousTime = Date.parse(event.at);
      if (!Object.hasOwn(transitions, event.to)) fail(at, 'unknown target status');
      if (index === 0) {
        if (event.from !== null || event.to !== 'PLANNED') fail(at, 'first event must be null → PLANNED');
      } else {
        if (event.from !== previous) fail(at, 'history chain is discontinuous');
        if (!Object.hasOwn(transitions, event.from)
          || (event.from !== event.to && !transitions[event.from].includes(event.to))) {
          fail(at, `illegal transition ${event.from} → ${event.to}`);
        }
      }
      previous = event.to;
    });
    if (previous !== item.status) fail(label, 'status does not match last history event');
  }
  function evidenceAndReview(item, label) {
    if (!Array.isArray(item.evidence)) fail(label, 'evidence must be an array');
    else item.evidence.forEach((entry, index) => {
      const at = `${label}.evidence[${index}]`;
      if (!record(entry)) { fail(at, 'must be an object'); return; }
      if (!evidenceKinds.has(entry.kind)) fail(at, 'unknown evidence kind');
      if (!evidenceResults.has(entry.result)) fail(at, 'unknown evidence result');
      checkPath(entry.path, `${at}.path`);
    });
    if (item.review !== null) {
      if (!record(item.review)) fail(label, 'review must be null or an object');
      else {
        for (const field of ['role', 'model']) requiredText(item.review, field, `${label}.review`);
        if (!reviewResults.has(item.review.result)) fail(label, 'unknown review result');
        if (!Array.isArray(item.review.blockingCorrections)
          || item.review.blockingCorrections.some(value => !text(value))) {
          fail(label, 'blockingCorrections must be an array of nonempty strings');
        }
        checkPath(item.review.report, `${label}.review.report`);
      }
    }
    if (item.status === 'APPROVED') {
      const passing = kind => Array.isArray(item.evidence)
        && item.evidence.some(entry => record(entry) && entry.kind === kind && entry.result === 'PASS');
      if (!passing('automated')) fail(label, 'approval requires passing automated evidence');
      if (item.kind === 'frontend' && !passing('rendered')) {
        fail(label, 'frontend approval requires passing rendered evidence');
      }
      if (Array.isArray(item.evidence) && item.evidence.some(entry => record(entry) && entry.result === 'FAIL')) {
        fail(label, 'approval cannot retain unresolved failing evidence');
      }
      if (Array.isArray(item.evidence) && item.evidence.some(entry => record(entry)
        && ['automated', 'rendered'].includes(entry.kind) && entry.result === 'GAP')) {
        fail(label, 'approval cannot retain missing mandatory automated/rendered evidence');
      }
      const review = item.review;
      if (!record(review) || review.role !== 'Astra lead/reviewer' || review.model !== 'gpt-6-astra'
        || !['PASS', 'PASS WITH FOLLOW-UP'].includes(review.result)
        || !Array.isArray(review.blockingCorrections) || review.blockingCorrections.length !== 0) {
        fail(label, 'approval requires a passing Astra review with zero blocking corrections');
      }
    }
  }
  function common(item, label) {
    for (const field of ['id', 'contract']) requiredText(item, field, label);
    if (!kinds.has(item.kind)) fail(label, 'unknown task/milestone kind');
    if (!Object.hasOwn(transitions, item.status)) fail(label, 'unknown status');
    checkPath(item.contract, `${label}.contract`);
    history(item, label);
    evidenceAndReview(item, label);
  }
  if (!record(state)) return { valid: false, errors: ['state must be an object'] };
  if (state.schemaVersion !== 1) fail('state', 'schemaVersion must be 1');
  if (state.policyVersion !== undefined && state.policyVersion !== 2) {
    fail('state', 'policyVersion must be 2 when declared');
  }
  for (const field of ['session', 'currentMilestone', 'stateWriter', 'applicationStatus', 'nextAction']) {
    requiredText(state, field, 'state');
  }
  if (typeof state.baseRevision !== 'string' || !/^[a-f0-9]{40}$/i.test(state.baseRevision)) {
    fail('state', 'baseRevision must be a full Git SHA');
  }
  checkPath(state.lockedDecisions, 'state.lockedDecisions');
  if (state.historyTimeConvention !== undefined && !text(state.historyTimeConvention)) {
    fail('state', 'historyTimeConvention must explain reconstructed recording times');
  }
  if (!Array.isArray(state.tasks)) fail('state', 'tasks must be an array');
  const tasks = Array.isArray(state.tasks) ? state.tasks : [];
  const byId = new Map();
  const ownership = new Map();
  tasks.forEach((task, index) => {
    const label = `tasks[${index}]`;
    if (!record(task)) { fail(label, 'must be an object'); return; }
    common(task, label);
    if (byId.has(task.id)) fail(label, `duplicate task ID ${task.id}`);
    else byId.set(task.id, task);
    if (!Array.isArray(task.dependsOn) || task.dependsOn.some(id => !text(id))
      || new Set(task.dependsOn).size !== task.dependsOn.length) {
      fail(label, 'dependsOn must contain unique nonempty task IDs');
    }
    if (!Array.isArray(task.filesAllowed)) fail(label, 'filesAllowed must be an array');
    const fileKeys = new Set();
    for (const file of Array.isArray(task.filesAllowed) ? task.filesAllowed : []) {
      if (!checkPath(file, `${label}.filesAllowed`, false, state.policyVersion === 2)) continue;
      const key = file.toLowerCase();
      if (fileKeys.has(key)) fail(label, `duplicate allowed path ${file}`);
      fileKeys.add(key);
    }
    if (task.deliveryReport !== undefined) {
      checkPath(task.deliveryReport, `${label}.deliveryReport`, deliveredStates.has(task.status));
    }
    if (task.bounded !== undefined && task.bounded !== true) fail(label, 'bounded declaration must be true when present');
    if (task.bounded === true) {
      if (task.scope === undefined) fail(label, 'bounded task requires scope');
      if (task.deliveryReport === undefined) fail(label, 'bounded task requires deliveryReport');
    }
    if (task.scope !== undefined) {
      if (!record(task.scope)) fail(label, 'scope must be an object');
      else {
        const scope = task.scope;
        for (const field of ['maxFiles', 'maxPageFamilies']) {
          if (!Number.isSafeInteger(scope[field]) || scope[field] < 0) {
            fail(`${label}.scope`, `${field} must be a nonnegative safe integer`);
          }
        }
        if (!Array.isArray(scope.pageFamilies) || scope.pageFamilies.some(value => !boundedLabel(value))
          || new Set(scope.pageFamilies.map(value => typeof value === 'string' ? value.toLowerCase() : value)).size !== scope.pageFamilies.length) {
          fail(`${label}.scope`, 'pageFamilies must contain unique finite explicit labels without wildcards or unbounded terms');
        }
        if (Array.isArray(task.filesAllowed) && task.filesAllowed.length > scope.maxFiles) {
          fail(`${label}.scope`, 'filesAllowed exceeds maxFiles');
        }
        if (Array.isArray(scope.pageFamilies) && scope.pageFamilies.length > scope.maxPageFamilies) {
          fail(`${label}.scope`, 'pageFamilies exceeds maxPageFamilies');
        }
        if (task.kind === 'frontend' && (!Array.isArray(scope.pageFamilies) || scope.pageFamilies.length === 0)) {
          fail(`${label}.scope`, 'frontend bounded scope requires explicit pageFamilies');
        }
      }
    }
    if (state.policyVersion === 2 && (task.status !== 'APPROVED' || record(task.owner)) && task.bounded !== true) {
      fail(label, 'policyVersion 2 pending task or retained ownership requires bounded declaration');
    }
    if (task.status === 'IN_PROGRESS' && !record(task.owner)) fail(label, 'IN_PROGRESS requires an owner');
    if (task.owner !== null) {
      if (!record(task.owner)) fail(label, 'owner must be null or an object');
      else {
        if (!['IN_PROGRESS', 'BLOCKED'].includes(task.status)) fail(label, 'owner retained in a non-writing status');
        for (const field of ['agent', 'model', 'session']) requiredText(task.owner, field, `${label}.owner`);
        if (task.owner.session !== state.session) fail(label, 'owner belongs to a stale session; reconcile explicitly');
        if (!utcTime(task.owner.leaseUntil)) fail(label, 'leaseUntil must be an ISO UTC timestamp');
        else if (Date.parse(task.owner.leaseUntil) <= now) fail(label, 'stale ownership lease; reconcile explicitly');
        for (const key of fileKeys) {
          for (const [reserved, owner] of ownership) {
            if (reserved === key || reserved.startsWith(`${key}/`) || key.startsWith(`${reserved}/`)) {
              fail(label, `overlapping active ownership of ${key} with ${owner} (${reserved})`);
            }
          }
          ownership.set(key, task.id);
        }
      }
    }
  });
  for (const [id, task] of byId) {
    for (const dependency of Array.isArray(task.dependsOn) ? task.dependsOn : []) {
      if (!byId.has(dependency)) fail(id, `unknown dependency ${dependency}`);
      else if ((dispatchedStates.has(task.status) || record(task.owner))
        && byId.get(dependency).status !== 'APPROVED') {
        fail(id, `dispatch/delivery requires APPROVED dependency ${dependency}`);
      }
    }
  }
  const visited = new Set();
  const visiting = new Set();
  function visit(id) {
    if (visiting.has(id)) { fail(id, 'cyclic dependency'); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    const task = byId.get(id);
    for (const dependency of Array.isArray(task?.dependsOn) ? task.dependsOn : []) {
      if (byId.has(dependency)) visit(dependency);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) visit(id);
  function validateMilestone(milestone, label) {
    if (!record(milestone)) { fail(label, 'must be an object'); return; }
    common(milestone, label);
    if (passingReview(milestone.review) && milestone.status !== 'APPROVED') {
      fail(label, 'passing review left open: accepted milestone/run must be APPROVED');
    }
    if (!Array.isArray(milestone.taskIds) || milestone.taskIds.length === 0
      || milestone.taskIds.some(id => !text(id)) || new Set(milestone.taskIds).size !== milestone.taskIds.length) {
      fail(label, 'taskIds must contain unique nonempty task IDs');
    }
    for (const id of Array.isArray(milestone.taskIds) ? milestone.taskIds : []) {
      if (!byId.has(id)) fail(label, `unknown task ${id}`);
      else if (milestone.status === 'APPROVED' && byId.get(id).status !== 'APPROVED') {
        fail(label, `approval requires APPROVED task ${id}`);
      }
    }
  }
  validateMilestone(state.milestone, 'milestone');
  if (record(state.milestone) && state.milestone.id !== state.currentMilestone) {
    fail('milestone', 'does not match currentMilestone');
  }
  if (state.policyVersion === 2 && !record(state.activeRun)) fail('state', 'policyVersion 2 requires activeRun');
  if (state.activeRun !== undefined) {
    validateMilestone(state.activeRun, 'activeRun');
    if (record(state.activeRun)) {
      const run = state.activeRun;
      if (run.id === state.currentMilestone) fail('activeRun', 'must be separate from the historical product milestone');
      if (typeof run.closed !== 'boolean') fail('activeRun', 'closed must be a boolean');
      else if (run.closed !== (run.status === 'APPROVED')) fail('activeRun', 'accepted run must be closed; unaccepted run must remain open');
      if (!record(run.budget)) fail('activeRun', 'budget must be an object');
      else {
        const budget = run.budget;
        if (budget.primaryWorkers !== 1) fail('activeRun.budget', 'primaryWorkers must be 1');
        if (![0, 1].includes(budget.additionalQaWorkers)) fail('activeRun.budget', 'additionalQaWorkers must be 0 or 1');
        if (budget.additionalQaWorkers === 1 && !text(budget.additionalQaJustification)) {
          fail('activeRun.budget', 'additional QA requires a concrete recorded justification');
        }
        if (budget.additionalQaWorkers === 0 && budget.additionalQaJustification !== null) {
          fail('activeRun.budget', 'unused additional QA justification must be null');
        }
        if (budget.maxCorrectionCycles !== 2) fail('activeRun.budget', 'maxCorrectionCycles must be 2');
        if (!Number.isSafeInteger(budget.correctionCycles) || budget.correctionCycles < 0 || budget.correctionCycles > 2) {
          fail('activeRun.budget', 'correctionCycles must be an integer from 0 to 2');
        }
        const owners = new Set(tasks.filter(task => record(task) && record(task.owner)).map(task => task.owner.agent));
        if (owners.size > 1 + (budget.additionalQaWorkers === 1 ? 1 : 0)) fail('activeRun', 'retained workers exceed declared run budget');
        if (run.closed === true && owners.size > 0) fail('activeRun', 'closed run cannot retain owners');
      }
      for (const id of Array.isArray(run.taskIds) ? run.taskIds : []) {
        const task = byId.get(id);
        if (task && task.bounded !== true) fail('activeRun', `current task ${id} requires bounded declaration`);
      }
      for (const task of tasks) {
        if (record(task) && record(task.owner)
          && (!Array.isArray(run.taskIds) || !run.taskIds.includes(task.id))) fail('activeRun', `retained owner outside run: ${task.id}`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

export function selfTest() {
  // Synthetic metadata and virtual file probe only; no fixture files are written.
  const now = '2026-10-04T12:00:00Z';
  const event = (from, to) => ({ from, to, at: now, actor: '/fixture/lead', reason: 'Synthetic fixture' });
  const history = statuses => statuses.map((status, index) => event(index ? statuses[index - 1] : null, status));
  const approvedHistory = history(['PLANNED', 'READY', 'IN_PROGRESS', 'IMPLEMENTED', 'REVIEW_REQUIRED', 'REVIEWING', 'APPROVED']);
  const review = { role: 'Astra lead/reviewer', model: 'gpt-6-astra', result: 'PASS', report: 'fixtures/review.md', blockingCorrections: [] };
  const task = {
    id: 'T1', kind: 'documentation', status: 'IN_PROGRESS', contract: 'fixtures/contract.md',
    dependsOn: [], filesAllowed: ['fixtures/output.md'],
    owner: { agent: '/fixture/worker', model: 'gpt-6.1-sol', session: 'fixture', leaseUntil: '2026-10-04T13:00:00Z' },
    evidence: [], review: null, history: history(['PLANNED', 'READY', 'IN_PROGRESS']),
  };
  const fixture = {
    schemaVersion: 1, session: 'fixture', baseRevision: 'a'.repeat(40), currentMilestone: 'M1',
    stateWriter: '/fixture/lead', lockedDecisions: 'fixtures/decisions.md', applicationStatus: 'Synthetic only',
    nextAction: 'Synthetic only', tasks: [task],
    milestone: { id: 'M1', kind: 'documentation', status: 'IN_PROGRESS', contract: 'fixtures/milestone.md',
      taskIds: ['T1'], evidence: [], review: null, history: history(['PLANNED', 'READY', 'IN_PROGRESS']) },
  };
  const files = new Set(['fixtures/contract.md', 'fixtures/review.md', 'fixtures/decisions.md', 'fixtures/milestone.md', 'fixtures/checks.json', 'fixtures/rendered.png']);
  const options = { now, inspectPath: relative => ({ inside: true, exists: files.has(relative), file: files.has(relative) }) };
  const approved = state => {
    state.tasks[0].status = 'APPROVED'; state.tasks[0].owner = null;
    state.tasks[0].history = structuredClone(approvedHistory);
    state.tasks[0].evidence = [{ kind: 'automated', path: 'fixtures/checks.json', result: 'PASS' }];
    state.tasks[0].review = structuredClone(review);
  };
  const bounded = state => {
    state.policyVersion = 2;
    Object.assign(state.tasks[0], { bounded: true, scope: { maxFiles: 1, maxPageFamilies: 0, pageFamilies: [] }, deliveryReport: 'fixtures/checks.json' });
    state.activeRun = { ...structuredClone(state.milestone), id: 'RUN1', closed: false,
      budget: { primaryWorkers: 1, additionalQaWorkers: 0, additionalQaJustification: null, maxCorrectionCycles: 2, correctionCycles: 0 } };
  };
  const cases = [
    ['valid active state', true, () => {}],
    ['valid approved documentation', true, approved],
    ['case-insensitive overlapping ownership', false, state => {
      const other = structuredClone(state.tasks[0]); other.id = 'T2'; other.filesAllowed = ['FIXTURES/output.md']; state.tasks.push(other);
    }, 'overlapping active ownership'],
    ['path-ancestor ownership collision', false, state => {
      state.tasks[0].filesAllowed = ['fixtures/new'];
      const other = structuredClone(state.tasks[0]); other.id = 'T2'; other.filesAllowed = ['fixtures/new/child.md']; state.tasks.push(other);
    }, 'overlapping active ownership'],
    ['unknown dependency', false, state => { state.tasks[0].dependsOn = ['missing']; }, 'unknown dependency'],
    ['unapproved dependency at dispatch', false, state => {
      const other = structuredClone(state.tasks[0]); other.id = 'T2'; other.status = 'READY'; other.owner = null;
      other.history = history(['PLANNED', 'READY']); state.tasks.push(other); state.tasks[0].dependsOn = ['T2'];
    }, 'requires APPROVED dependency'],
    ['cyclic dependencies', false, state => { state.tasks[0].dependsOn = ['T1']; }, 'cyclic dependency'],
    ['stale lease', false, state => { state.tasks[0].owner.leaseUntil = now; }, 'stale ownership lease'],
    ['stale session', false, state => { state.tasks[0].owner.session = 'old'; }, 'stale session'],
    ['ownerless active task', false, state => { state.tasks[0].owner = null; }, 'requires an owner'],
    ['unknown state', false, state => { state.tasks[0].status = 'COMPLETE'; }, 'unknown status'],
    ['illegal transition', false, state => {
      state.tasks[0].history = history(['PLANNED', 'IN_PROGRESS']);
    }, 'illegal transition'],
    ['discontinuous history', false, state => { state.tasks[0].history[2].from = 'PLANNED'; }, 'discontinuous'],
    ['status/history mismatch', false, state => { state.tasks[0].status = 'BLOCKED'; }, 'does not match'],
    ['history out of chronological order', false, state => { state.tasks[0].history[1].at = '2026-10-04T11:00:00Z'; }, 'not chronological'],
    ['missing frontend evidence', false, state => { approved(state); state.tasks[0].kind = 'frontend'; }, 'requires passing rendered'],
    ['invalid reviewer', false, state => { approved(state); state.tasks[0].review.model = 'gpt-6.1-sol'; }, 'passing Astra review'],
    ['blocking approval corrections', false, state => { approved(state); state.tasks[0].review.blockingCorrections = ['Fix']; }, 'zero blocking corrections'],
    ['missing automated evidence', false, state => { approved(state); state.tasks[0].evidence = []; }, 'passing automated'],
    ['missing review report', false, state => { approved(state); state.tasks[0].review.report = 'fixtures/absent.md'; }, 'does not exist'],
    ['failed evidence', false, state => { approved(state); state.tasks[0].evidence.push({ kind: 'automated', path: 'fixtures/checks.json', result: 'FAIL' }); }, 'unresolved failing'],
    ['missing mandatory evidence', false, state => { approved(state); state.tasks[0].evidence.push({ kind: 'automated', path: 'fixtures/checks.json', result: 'GAP' }); }, 'missing mandatory'],
    ['unsafe allowed path', false, state => { state.tasks[0].filesAllowed = ['../outside.md']; }, 'safe exact'],
    ['glob allowed path', false, state => { state.tasks[0].filesAllowed = ['fixtures/*.md']; }, 'safe exact'],
    ['duplicate ID', false, state => { state.tasks.push(structuredClone(state.tasks[0])); }, 'duplicate task ID'],
    ['unknown milestone task', false, state => { state.milestone.taskIds = ['missing']; }, 'unknown task'],
    ['milestone prematurely approved', false, state => {
      state.milestone.status = 'APPROVED'; state.milestone.history = structuredClone(approvedHistory);
      state.milestone.review = structuredClone(review);
      state.milestone.evidence = [{ kind: 'automated', path: 'fixtures/checks.json', result: 'PASS' }];
    }, 'requires APPROVED task'],
    ['valid approved frontend milestone', true, state => {
      approved(state); state.tasks[0].kind = 'frontend';
      state.tasks[0].evidence.push({ kind: 'rendered', path: 'fixtures/rendered.png', result: 'PASS' });
      state.milestone.kind = 'frontend'; state.milestone.status = 'APPROVED';
      state.milestone.history = structuredClone(approvedHistory); state.milestone.review = structuredClone(review);
      state.milestone.evidence = structuredClone(state.tasks[0].evidence);
    }],
    ['retained blocked ownership conflicts', false, state => {
      const other = structuredClone(state.tasks[0]); other.id = 'T2'; other.status = 'BLOCKED';
      other.history.push(event('IN_PROGRESS', 'BLOCKED')); state.tasks.push(other);
    }, 'overlapping active ownership'],
    ['valid bounded run', true, bounded],
    ['policy2 requires run', false, state => { bounded(state); delete state.activeRun; }, 'requires activeRun'],
    ['ownerless pending task cannot evade declaration', false, state => { bounded(state); const pending = structuredClone(state.tasks[0]); pending.id = 'T2'; pending.owner = null; pending.status = 'PLANNED'; pending.history = history(['PLANNED']); delete pending.bounded; state.tasks.push(pending); }, 'requires bounded declaration'],
    ['delivered current task cannot evade declaration', false, state => { bounded(state); approved(state); delete state.tasks[0].bounded; }, 'requires bounded declaration'],
    ['bounded task missing scope', false, state => { bounded(state); delete state.tasks[0].scope; }, 'requires scope'],
    ['bounded task missing delivery', false, state => { bounded(state); delete state.tasks[0].deliveryReport; }, 'requires deliveryReport'],
    ['missing delivered report', false, state => { bounded(state); approved(state); state.tasks[0].deliveryReport = 'fixtures/absent.md'; }, 'referenced file does not exist'],
    ['new declared report may await delivery', true, state => { bounded(state); state.tasks[0].deliveryReport = 'fixtures/new-delivery.md'; }],
    ['file budget exceeded', false, state => { bounded(state); state.tasks[0].scope.maxFiles = 0; }, 'exceeds maxFiles'],
    ['page budget exceeded', false, state => { bounded(state); state.tasks[0].scope.pageFamilies = ['Contact']; }, 'exceeds maxPageFamilies'],
    ['unbounded family label', false, state => { bounded(state); state.tasks[0].scope.pageFamilies = ['all frontend']; }, 'finite explicit labels'],
    ['wildcard family label', false, state => { bounded(state); state.tasks[0].scope.pageFamilies = ['Contact/*']; }, 'finite explicit labels'],
    ['empty frontend family declaration', false, state => { bounded(state); state.tasks[0].kind = 'frontend'; }, 'requires explicit pageFamilies'],
    ['ambiguous missing directory scope', false, state => { bounded(state); state.tasks[0].filesAllowed = ['fixtures/new']; }, 'explicit file name'],
    ['accepted milestone left open', false, state => { state.milestone.review = structuredClone(review); }, 'passing review left open'],
    ['accepted run left open', false, state => { bounded(state); state.activeRun.review = structuredClone(review); }, 'passing review left open'],
    ['approved run must close', false, state => { bounded(state); approved(state); state.activeRun.status = 'APPROVED'; state.activeRun.history = structuredClone(approvedHistory); state.activeRun.review = structuredClone(review); state.activeRun.evidence = structuredClone(state.tasks[0].evidence); }, 'accepted run must be closed'],
    ['valid closed accepted run', true, state => { bounded(state); approved(state); state.activeRun.status = 'APPROVED'; state.activeRun.closed = true; state.activeRun.history = structuredClone(approvedHistory); state.activeRun.review = structuredClone(review); state.activeRun.evidence = structuredClone(state.tasks[0].evidence); }],
    ['unsupported correction cycle', false, state => { bounded(state); state.activeRun.budget.correctionCycles = 3; }, 'integer from 0 to 2'],
    ['additional QA needs justification', false, state => { bounded(state); state.activeRun.budget.additionalQaWorkers = 1; }, 'concrete recorded justification'],
    ['third worker forbidden', false, state => { bounded(state); for (const id of ['T2', 'T3']) { const other = structuredClone(state.tasks[0]); other.id = id; other.filesAllowed = [`fixtures/${id}.md`]; other.owner.agent = `/fixture/${id}`; state.tasks.push(other); state.activeRun.taskIds.push(id); } }, 'exceed declared run budget'],
    ['owner outside run forbidden', false, state => { bounded(state); state.activeRun.taskIds = ['missing']; }, 'retained owner outside run'],
    ['malformed run membership fails without throwing', false, state => { bounded(state); state.activeRun.taskIds = {}; }, 'taskIds must contain'],
    ['closed run cannot retain worker', false, state => { bounded(state); state.activeRun.status = 'APPROVED'; state.activeRun.closed = true; state.activeRun.history = structuredClone(approvedHistory); state.activeRun.review = structuredClone(review); state.activeRun.evidence = [{ kind: 'automated', path: 'fixtures/checks.json', result: 'PASS' }]; }, 'closed run cannot retain owners'],
    ['negative file budget', false, state => { bounded(state); state.tasks[0].scope.maxFiles = -1; }, 'nonnegative safe integer'],
    ['duplicate family labels', false, state => { bounded(state); state.tasks[0].scope.maxPageFamilies = 2; state.tasks[0].scope.pageFamilies = ['Contact', 'contact']; }, 'unique finite'],
  ];
  for (const [name, expected, mutate, expectedError] of cases) {
    const state = structuredClone(fixture); mutate(state);
    const result = validateState(state, options);
    assert.equal(result.valid, expected, `${name}: ${result.errors.join('; ')}`);
    if (expectedError) assert.ok(result.errors.some(error => error.includes(expectedError)), `${name}: missing specific rejection`);
  }
  // Prove boundary/directory rejection independently of fixture path existence.
  for (const [name, probe, expectedError] of [
    ['symlink escape', () => ({ inside: false, exists: true, file: true }), 'escapes repository'],
    ['directory alias', () => ({ inside: true, exists: true, file: false }), 'not a directory'],
  ]) {
    const result = validateState(fixture, { ...options, inspectPath: probe });
    assert.equal(result.valid, false, name);
    assert.ok(result.errors.some(error => error.includes(expectedError)), name);
  }
  // These tests exercise the production resolver's identity comparison with a
  // simulated filesystem. They create no actual symlinks, junctions or artifacts.
  const root = realpathSync(defaultRoot);
  for (const newFile of [false, true]) {
    const state = structuredClone(fixture);
    const alias = 'fixtures/alias';
    const relative = newFile ? `${alias}/new.md` : `${alias}.md`;
    state.tasks[0].filesAllowed = [relative];
    const aliasPath = path.resolve(root, newFile ? alias : relative);
    const canonicalPath = path.resolve(root, newFile ? 'fixtures/real' : 'fixtures/real.md');
    const missing = () => Object.assign(new Error('Synthetic missing file'), { code: 'ENOENT' });
    const io = {
      realpathSync: candidate => {
        if (candidate === aliasPath) return canonicalPath;
        throw missing();
      },
      statSync: () => {
        if (newFile) throw missing();
        return { isFile: () => true };
      },
    };
    const result = validateState(state, {
      ...options,
      inspectPath: candidate => candidate === relative
        ? filesystemProbe(root, candidate, io) : options.inspectPath(candidate),
    });
    assert.equal(result.valid, false, newFile ? 'alias ancestor of new file' : 'internal file alias');
    assert.ok(result.errors.some(error => error.includes('noncanonical filesystem alias')));
  }
  return { passed: cases.length + 4, message: 'Synthetic in-memory protocol/resolver tests only; no actual junction creation, app acceptance or model attestation.' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === modulePath) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === '--self-test') {
      const result = selfTest();
      console.log(`PASS: ${result.passed} state-validator self-tests. ${result.message}`);
    } else if (args.length === 0 || (args.length === 2 && args[0] === '--state')) {
      const statePath = args.length === 0 ? path.join(defaultRoot, 'docs/orchestration/state.json') : path.resolve(args[1]);
      const state = JSON.parse(readFileSync(statePath, 'utf8'));
      const result = validateState(state);
      if (result.valid) console.log(`PASS: orchestration state ${state.currentMilestone}; ${state.tasks.length} task(s). Structural checks only.`);
      else { console.error(result.errors.join('\n')); process.exitCode = 1; }
    } else {
      console.error('Usage: node docs/orchestration/validate-state.mjs [--self-test | --state <json-file>]');
      process.exitCode = 1;
    }
  } catch (error) { console.error(`FAIL: ${error.message}`); process.exitCode = 1; }
}
