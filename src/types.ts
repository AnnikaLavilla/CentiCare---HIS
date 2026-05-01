/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MedicationEntry {
  dateTime: string;
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  indication: string;
  nursingResponsibility: string;
}

export interface DoctorOrder {
  dateTime: string;
  order: string;
  rationale: string;
}

export interface VitalSign {
  time: string;
  bp: string;
  rr: string;
  hr: number;
  temp: string;
  remarks: string;
}

export interface IVEntry {
  solution: string;
  volume: string;
  rate: string;
  dropRate: string;
  site: string;
  condition: string;
  remarks: string;
}

export interface LabResult {
  test: string;
  normalValues: string;
  result: string;
  interpretation: string;
}

export interface ImagingResult {
  date: string;
  type: string;
  procedure: string;
  findings: string;
  impression: string;
}

export interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medicine' | 'Supply' | 'Equipment';
  stock: number;
  unit: string;
  expiryDate?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface KardexTask {
  id: string;
  patientId: string;
  patientName: string;
  task: string;
  timeDue: string;
  status: 'Pending' | 'Completed' | 'Missed';
  priority: 'High' | 'Normal' | 'Stat';
}

export interface Patient {
  id: string;
  name: string;
  status: 'Inpatient' | 'Outpatient' | 'Emergency';
  clinicalStatus: 'Active' | 'MGH' | 'Cleared' | 'Expired' | 'Discharged';
  gender: 'Male' | 'Female' | 'Other';
  admission: string;
  discharge: string;
  ward: string;
  age: number;
  diagnosis: string;
  locked: boolean;
  demographics: {
    address: string;
    phone: string;
    civilStatus: string;
    religion: string;
    nationality: string;
  };
  registry: {
    caseNumber: string;
    hmo: string;
    attendingPhysician: string;
    admissionSource: string;
  };
  medicalRecord: {
    medications: MedicationEntry[];
    doctorOrders: DoctorOrder[];
    vitals: VitalSign[];
    intakeOutput: {
      intake: { type: string; amount: string }[];
      output: { type: string; amount: string }[];
    };
    ivSheet: IVEntry[];
    labs: LabResult[];
    imaging?: ImagingResult[];
    auditLogs?: AuditLog[];
    sbar?: {
      situation: string;
      background: string;
      assessment: string;
      recommendation: string;
    };
  };
}

export type Role = 'Patient' | 'Staff' | 'Admin';

export interface User {
  username: string;
  role: Role;
}

export type TabType = 'dashboard' | 'patients' | 'hmo' | 'emergency' | 'outpatient' | 'inpatient' | 'pharmacy' | 'wardView' | 'kardex' | 'account';
