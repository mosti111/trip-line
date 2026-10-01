package com.tripline.platform.services;

import com.tripline.platform.shared.Snapshot;
import jakarta.persistence.*;

@Entity @Table(name="services")
class TravelService extends Snapshot { public boolean archived; }
