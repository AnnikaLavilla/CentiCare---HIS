/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, InventoryItem, KardexTask } from './types';

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'EMER-001', name: 'Epinephrine 1mg/mL', category: 'Medicine', stock: 15, unit: 'Vials', expiryDate: '2026-12-01', status: 'In Stock' },
  { id: 'EMER-002', name: 'Amiodarone 150mg', category: 'Medicine', stock: 8, unit: 'Ampules', expiryDate: '2026-08-15', status: 'In Stock' },
  { id: 'EMER-003', name: 'Atropine Sulfate 1mg', category: 'Medicine', stock: 12, unit: 'Vials', expiryDate: '2027-01-10', status: 'In Stock' },
  { id: 'EMER-004', name: 'Adenosine 6mg/2mL', category: 'Medicine', stock: 4, unit: 'Vials', expiryDate: '2026-11-20', status: 'Low Stock' },
  { id: 'EMER-005', name: 'Sodium Bicarbonate 8.4%', category: 'Medicine', stock: 10, unit: 'Prefilled Syringe', expiryDate: '2026-10-01', status: 'In Stock' },
  { id: 'CART-001', name: 'Intubation Kit (Adult)', category: 'Supply', stock: 2, unit: 'Sets', status: 'In Stock' },
  { id: 'CART-002', name: 'Defibrillator Pads', category: 'Supply', stock: 4, unit: 'Pairs', status: 'In Stock' },
  { id: 'CART-003', name: 'Laryngoscope Blade Set', category: 'Equipment', stock: 3, unit: 'Sets', status: 'In Stock' },
  { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Medicine', stock: 1250, unit: 'Tabs', expiryDate: '2027-12-31', status: 'In Stock' },
  { id: 'MED-002', name: 'Amoxicillin 500mg', category: 'Medicine', stock: 45, unit: 'Caps', expiryDate: '2026-06-20', status: 'Low Stock' },
  { id: 'SUP-001', name: 'Sterile Gauze 4x4', category: 'Supply', stock: 500, unit: 'Packs', status: 'In Stock' },
  { id: 'SUP-002', name: 'Disposable Syringe 5cc', category: 'Supply', stock: 0, unit: 'Pcs', status: 'Out of Stock' },
  { id: 'EQP-001', name: 'Digital Thermometer', category: 'Equipment', stock: 12, unit: 'Units', status: 'In Stock' }
];

export const KARDEX_TASKS: KardexTask[] = [
  { id: 'K-001', patientId: 'PT-001001', patientName: 'Antonina Borromeo', task: 'Administer Oxytocin Infusion', timeDue: '10:00 AM', status: 'Pending', priority: 'High' },
  { id: 'K-002', patientId: 'PT-001011', patientName: 'Ivana Alawi', task: 'Monitor Post-Op Vitals', timeDue: '10:30 AM', status: 'Completed', priority: 'Normal' },
  { id: 'K-003', patientId: 'ER-002001', patientName: 'Bong Go', task: 'Prepare for Appendectomy', timeDue: 'ASAP', status: 'Pending', priority: 'Stat' }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "PT-001001",
    name: "Antonina Borromeo",
    status: "Inpatient",
    clinicalStatus: "Active",
    gender: "Female",
    admission: "2026-04-01",
    discharge: "-",
    ward: "Maternity",
    age: 28,
    diagnosis: "Postpartum Hemorrhage (PPH)",
    locked: true,
    demographics: {
      address: "123 Medical Ave, Quezon City",
      phone: "0917-000-0001",
      civilStatus: "Married",
      religion: "Catholic",
      nationality: "Filipino"
    },
    registry: {
      caseNumber: "CN-2026-0001",
      hmo: "PhilHealth",
      attendingPhysician: "Dr. Gomez",
      admissionSource: "Emergency Room"
    },
    medicalRecord: {
      medications: [
        {
          dateTime: "April 2, 2026 – 5:10",
          medication: "Lactated Ringer’s Solution",
          dose: "1L @ fast drip",
          route: "IV",
          frequency: "STAT / Continuous",
          indication: "To restore circulating blood volume",
          nursingResponsibility: "Monitor IV site, regulate infusion rate, assess for fluid overload, monitor VS"
        },
        {
          dateTime: "April 2, 2026 – 5:25",
          medication: "Oxytocin",
          dose: "20 units in IVF",
          route: "IV infusion",
          frequency: "Continuous",
          indication: "To promote uterine contraction and reduce bleeding",
          nursingResponsibility: "Monitor uterine tone, observe for water intoxication, monitor VS and bleeding"
        },
        {
          dateTime: "April 2, 2026 – 5:35",
          medication: "Tranexamic Acid",
          dose: "1 g",
          route: "IV",
          frequency: "STAT",
          indication: "To reduce bleeding (antifibrinolytic)",
          nursingResponsibility: "Administer slowly over 10 mins, monitor for thrombosis, assess bleeding"
        },
        {
          dateTime: "April 2, 2026 – 5:45",
          medication: "Methylergometrine",
          dose: "0.2 mg",
          route: "IM",
          frequency: "q2–4 hrs PRN",
          indication: "To increase uterine tone and control hemorrhage",
          nursingResponsibility: "Check BP before giving (contraindicated in hypertension), monitor uterine response"
        }
      ],
      doctorOrders: [
        { dateTime: "April 2, 2026", order: "Please admit patient", rationale: "For proper and continuous monitoring" },
        { dateTime: "4:30", order: "Secure consent", rationale: "Legal requirement before procedures" },
        { dateTime: "4:45", order: "Monitor vitals q15", rationale: "To detect early signs of shock" },
        { dateTime: "5:00", order: "Labs: CBC, Platelet Count, Blood typing & crossmatch, UA", rationale: "Assess blood loss, clotting status, renal function" },
        { dateTime: "5:10", order: "Start IVF: Lactated Ringers 1L @ Fast drip", rationale: "To restore circulating blood volume" },
        { dateTime: "5:15", order: "Insert large-bore IV cannula (16-18G)", rationale: "For rapid fluid and blood administration" },
        { dateTime: "5:25", order: "Administer Oxytocin 20U in IVF", rationale: "To promote uterine contraction" },
        { dateTime: "5:35", order: "Administer Tranexamic Acid 1g IV", rationale: "To reduce bleeding" },
        { dateTime: "5:45", order: "Administer Methylergometrine 0.2 mg IM (if BP normal)", rationale: "To control uterine atony" },
        { dateTime: "6:00", order: "Oxygen inhalation 6–10 L/min via face mask", rationale: "To improve oxygenation" },
        { dateTime: "6:15", order: "Insert Foley catheter; monitor I&O q1", rationale: "To assess kidney perfusion and fluid status" },
        { dateTime: "6:30", order: "Prepare 2–3 units PRBC for transfusion", rationale: "To replace blood loss" },
        { dateTime: "7:00", order: "NPO until stable", rationale: "To prepare for possible intervention" },
        { dateTime: "7:30", order: "Refer OB-Gyne immediately if bleeding persists", rationale: "For advanced management/intervention" }
      ],
      vitals: [
        { time: "4:45 PM", bp: "90/60", rr: "24", hr: 120, temp: "36.8", remarks: "Signs of hypovolemic shock (PPH)" },
        { time: "5:00 PM", bp: "80/50", rr: "26", hr: 124, temp: "36.8", remarks: "Ongoing bleeding, tachycardia worsening" },
        { time: "5:15 PM", bp: "90/60", rr: "24", hr: 118, temp: "36.7", remarks: "Slight response to IV fluids/oxytocin" },
        { time: "5:30 PM", bp: "90/60", rr: "22", hr: 110, temp: "36.7", remarks: "Improving perfusion, still monitor closely" },
        { time: "5:45 PM", bp: "100/70", rr: "20", hr: 100, temp: "36.8", remarks: "Stabilizing condition" },
        { time: "6:00 PM", bp: "100/70", rr: "20", hr: 96, temp: "36.8", remarks: "Continued improvement" },
        { time: "6:15 PM", bp: "100/70", rr: "18", hr: 92, temp: "36.8", remarks: "Hemodynamically stable" },
        { time: "6:30 PM", bp: "110/80", rr: "18", hr: 88, temp: "36.9", remarks: "Stable vitals, patient alert" },
        { time: "6:45 PM", bp: "110/80", rr: "18", hr: 84, temp: "36.9", remarks: "Condition stabilized" }
      ],
      intakeOutput: {
        intake: [{ type: "IV Fluids (NSS/LR)", amount: "As ordered (1-2 L)" }],
        output: [
          { type: "Urine", amount: "≥30 mL/hr" },
          { type: "Blood Loss", amount: ">500 mL (PPH)" }
        ]
      },
      ivSheet: [
        {
          solution: "Lactated Ringer's Solution",
          volume: "1000 mL",
          rate: "125 mL/hr",
          dropRate: "125 gtts/min",
          site: "Right/Left arm",
          condition: "Patent, no swelling",
          remarks: "For fluid resuscitation"
        },
        {
          solution: "Oxytocin in LR",
          volume: "1000 mL",
          rate: "As ordered",
          dropRate: "As computed",
          site: "IV line",
          condition: "Monitor for infiltration",
          remarks: "Promotes uterine contraction"
        }
      ],
      labs: [
        { test: "Hemoglobin (Hgb)", normalValues: "12–16 g/dL", result: "↓", interpretation: "Blood loss (hemorrhage)" },
        { test: "Hematocrit", normalValues: "36–46%", result: "↓", interpretation: "Decreased circulating volume" },
        { test: "RBC Count", normalValues: "4.2–5.4 M/mm³", result: "↓", interpretation: "Anemia due to bleeding" },
        { test: "WBC Count", normalValues: "5,000–10,000/mm³", result: "Normal/↑", interpretation: "Stress response" },
        { test: "Platelets", normalValues: "150,000–400,000/mm³", result: "Normal/↑", interpretation: "Clotting status" }
      ],
      imaging: [
        {
          date: "April 2, 2026 - 08:30",
          type: "X-Ray",
          procedure: "Chest PA View",
          findings: "Normal lung expansion. No focal infiltrates or pleural effusion.",
          impression: "Negative for acute pulmonary process."
        },
        {
          date: "April 2, 2026 - 14:15",
          type: "Ultrasound",
          procedure: "Transvaginal / Pelvic Ultrasound",
          findings: "Enlarged uterus with heavy clot accumulation. Adnexae are normal.",
          impression: "Consistent with Postpartum Hemorrhage due to Uterine Atony."
        }
      ],
      auditLogs: [
        { timestamp: "2026-05-01 08:00:15", user: "Gianne Anggong", action: "Viewed Chart", details: "Accessed full medical history and lab results." },
        { timestamp: "2026-05-01 09:12:44", user: "Dr. Gomez", action: "Updated Order", details: "Added PRBC transfusion order." },
        { timestamp: "2026-05-01 10:05:01", user: "Nikko Matulac", action: "Vital Entry", details: "Recorded stable VS for 10:00 AM." }
      ],
      sbar: {
        situation: "Mrs. Antonina Borromeo, 28-year-old (G3P2), delivered via normal spontaneous vaginal delivery 1 hour ago. She is currently experiencing postpartum hemorrhage (PPH) with signs of hypovolemic shock, reporting dizziness and extreme weakness.",
        background: "Post-delivery was stable until 30 minutes ago when heavy vaginal bleeding began. A perineal pad was fully saturated within 10 minutes. No prior history of bleeding disorders noted.",
        assessment: "Patient is hypotensive (90/60 mmHg), tachycardic (120 bpm), and tachypneic (24 cpm). Physical exam reveals a boggy, enlarged uterus with the fundus above the umbilicus. Continuous bright red bleeding noted. Skin is pale and clammy. Diagnosis: PPH secondary to uterine atony.",
        recommendation: "Immediate uterine massage initiated. Administer Oxytocin 20U IV and IV fluids (LR/NSS) as ordered. Monitor vitals q15m. Prepare for potential PRBC transfusion. Maintain NPO status and notify OB-Gyne for continuous assessment."
      }
    }

  },
  {
    id: "PT-001011",
    name: "Ivana Alawi",
    status: "Inpatient",
    clinicalStatus: "MGH",
    gender: "Female",
    admission: "2026-05-01",
    discharge: "-",
    ward: "Maternity",
    age: 28,
    diagnosis: "Post-Op Recovery",
    locked: false,
    demographics: {
      address: "45 Prime Blvd, Taguig",
      phone: "0917-555-6666",
      civilStatus: "Single",
      religion: "Catholic",
      nationality: "Filipino"
    },
    registry: {
      caseNumber: "CN-2026-0412",
      hmo: "Maxicare",
      attendingPhysician: "Dr. Santos",
      admissionSource: "OPD Referral"
    },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "PT-001002",
    name: "Sarah Duterte",
    status: "Inpatient",
    clinicalStatus: "Active",
    gender: "Female",
    admission: "2026-04-28",
    discharge: "-",
    ward: "Cardiology",
    age: 46,
    diagnosis: "Hypertensive Crisis",
    locked: false,
    demographics: {
      address: "Davao City Residence",
      phone: "0918-999-8888",
      civilStatus: "Married",
      religion: "Catholic",
      nationality: "Filipino"
    },
    registry: {
      caseNumber: "CN-2026-039",
      hmo: "PhilHealth / Self Pay",
      attendingPhysician: "Dr. Reyes",
      admissionSource: "Emergency Room"
    },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "PT-001005",
    name: "Gela Alonte",
    status: "Inpatient",
    clinicalStatus: "Discharged",
    gender: "Female",
    admission: "2026-04-15",
    discharge: "-",
    ward: "Pediatrics",
    age: 22,
    diagnosis: "Severe Tonsillitis",
    locked: true,
    demographics: { address: "Binan, Laguna", phone: "0916-444-5555", civilStatus: "Single", religion: "Catholic", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-015", hmo: "Maxicare", attendingPhysician: "Dr. Alon", admissionSource: "OPD Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "PT-001008",
    name: "Liza Soberano",
    status: "Inpatient",
    clinicalStatus: "Active",
    gender: "Female",
    admission: "2026-04-30",
    discharge: "-",
    ward: "Internal Medicine",
    age: 26,
    diagnosis: "Acute Gastritis",
    locked: false,
    demographics: { address: "Pangasinan", phone: "0999-888-7777", civilStatus: "Single", religion: "Catholic", nationality: "Filipino-American" },
    registry: { caseNumber: "CN-2026-030", hmo: "Pacific Cross", attendingPhysician: "Dr. So", admissionSource: "Emergency Room" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "ER-002001",
    name: "Bong Go",
    status: "Emergency",
    clinicalStatus: "Active",
    gender: "Male",
    admission: "2026-05-01",
    discharge: "-",
    ward: "ER Trauma",
    age: 50,
    diagnosis: "Acute Appendicitis",
    locked: false,
    demographics: { address: "San Juan, Metro Manila", phone: "0917-111-2222", civilStatus: "Married", religion: "Catholic", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-ER01", hmo: "PhilHealth", attendingPhysician: "Dr. Lim", admissionSource: "Self-Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "ER-002002",
    name: "Bato De La Rosa",
    status: "Emergency",
    clinicalStatus: "Active",
    gender: "Male",
    admission: "2026-05-01",
    discharge: "-",
    ward: "ER Isolation",
    age: 62,
    diagnosis: "Suspected Pneumonia",
    locked: false,
    demographics: { address: "Davao City", phone: "0917-888-9999", civilStatus: "Married", religion: "Catholic", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-ER02", hmo: "PhilHealth", attendingPhysician: "Dr. Dela", admissionSource: "Self-Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "ER-002005",
    name: "Robin Padilla",
    status: "Emergency",
    clinicalStatus: "Active",
    gender: "Male",
    admission: "2026-05-01",
    discharge: "-",
    ward: "ER",
    age: 54,
    diagnosis: "Head Injury - Laceration",
    locked: false,
    demographics: { address: "Bulacan", phone: "0915-111-2222", civilStatus: "Married", religion: "Islam", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-ER05", hmo: "PhilHealth", attendingPhysician: "Dr. Khan", admissionSource: "Emergency Room" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "OP-003001",
    name: "Claudine Co",
    status: "Outpatient",
    clinicalStatus: "Cleared",
    gender: "Female",
    admission: "2026-05-01",
    discharge: "2026-05-01",
    ward: "OPD Clinic",
    age: 44,
    diagnosis: "Routine Physical Examination",
    locked: false,
    demographics: { address: "Makati City", phone: "0917-333-4444", civilStatus: "Married", religion: "Catholic", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-OP01", hmo: "Intellicare", attendingPhysician: "Dr. Tan", admissionSource: "HMO Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "OP-003002",
    name: "Jammy Cruz",
    status: "Outpatient",
    clinicalStatus: "Cleared",
    gender: "Female",
    admission: "2026-05-01",
    discharge: "2026-05-01",
    ward: "Dermatology",
    age: 29,
    diagnosis: "Allergic Rhinitis",
    locked: false,
    demographics: { address: "Quezon City", phone: "0908-777-6666", civilStatus: "Single", religion: "Catholic", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-OP02", hmo: "MediCard", attendingPhysician: "Dr. Co", admissionSource: "Self-Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "OP-003008",
    name: "Vice Ganda",
    status: "Outpatient",
    clinicalStatus: "Cleared",
    gender: "Other",
    admission: "2026-05-01",
    discharge: "2026-05-01",
    ward: "ENT Clinic",
    age: 48,
    diagnosis: "Vocal Cord Nodule",
    locked: false,
    demographics: { address: "Manila", phone: "0917-000-1111", civilStatus: "Partnered", religion: "Other", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-OP08", hmo: "Self Pay", attendingPhysician: "Dr. Vic", admissionSource: "Self-Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "PT-001010",
    name: "Neri Colmenares",
    status: "Inpatient",
    clinicalStatus: "Expired",
    gender: "Female",
    admission: "2026-04-20",
    discharge: "-",
    ward: "Neurology",
    age: 55,
    diagnosis: "Chronic Migraine",
    locked: false,
    demographics: { address: "Bacolod City", phone: "0918-777-6666", civilStatus: "Married", religion: "Other", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-009", hmo: "Self Pay", attendingPhysician: "Dr. Ferrer", admissionSource: "ER Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "ER-002010",
    name: "Leni Robredo",
    status: "Emergency",
    clinicalStatus: "Active",
    gender: "Female",
    admission: "2026-05-01",
    discharge: "-",
    ward: "ER",
    age: 59,
    diagnosis: "Asthmatic Attack",
    locked: false,
    demographics: { address: "Naga City", phone: "0917-888-1111", civilStatus: "Widowed", religion: "Catholic", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-ER10", hmo: "PhilHealth", attendingPhysician: "Dr. Gerona", admissionSource: "Emergency Room" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  },
  {
    id: "OP-003010",
    name: "Coco Martin",
    status: "Outpatient",
    clinicalStatus: "Cleared",
    gender: "Male",
    admission: "2026-05-01",
    discharge: "2026-05-01",
    ward: "Orthopedic Clinic",
    age: 42,
    diagnosis: "Sprained Wrist",
    locked: false,
    demographics: { address: "Novaliches", phone: "0917-222-3333", civilStatus: "Single", religion: "Catholic", nationality: "Filipino" },
    registry: { caseNumber: "CN-2026-OP10", hmo: "Maxicare", attendingPhysician: "Dr. Nacino", admissionSource: "Self-Referral" },
    medicalRecord: { medications: [], doctorOrders: [], vitals: [], intakeOutput: { intake: [], output: [] }, ivSheet: [], labs: [] }
  }
];
