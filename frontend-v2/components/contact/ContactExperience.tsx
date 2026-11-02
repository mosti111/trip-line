import { t, ui } from '@/lib/i18n';
import { Inquiry, type InquiryProps } from '../travel/Inquiry';
import '@/styles/recovery-contact.css';

export function ContactExperience(props:InquiryProps) {
  const {locale}=props;
  return <div className="recovery-contact"><header className="rc-contact-intro"><div className="wrap"><span className="rc-contact-kicker">Trip Line / {ui.contact[locale]}</span><h1>{t('Let’s shape your journey.','لنرسم رحلتك معاً.','Yolculuğunuzu birlikte şekillendirelim.')[locale]}</h1><p>{ui.formBody[locale]}</p></div></header><Inquiry {...props}/></div>;
}
