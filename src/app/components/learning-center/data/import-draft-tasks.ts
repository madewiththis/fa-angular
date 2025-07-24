/**
 * Utility to import draft tasks from JSON into the content management system
 * This is a one-time utility to move tasks from tasks-draft.json to the official library
 */

import { LearningContentService } from '../services/learning-content.service';

// Import the draft tasks JSON (this would normally be a JSON file read)
const DRAFT_TASKS_DATA = {
  "tasks": [
    {
      "id": "task_dashboard_001",
      "name": "ข้อมูลในกราฟแดชบอร์ดมาจากไหนบ้าง",
      "englishName": "Where does the dashboard graph data come from?",
      "description": "เรียนรู้วิธีการที่ FlowAccount รวบรวมและแสดงข้อมูลในกราฟแดชบอร์ด เข้าใจแหล่งที่มาของข้อมูลแต่ละประเภท",
      "category": "Dashboard",
      "featureLink": {
        "mainFeature": "dashboard",
        "subFeature": "overview",
        "route": "/dashboard/overview",
        "displayLocation": ["dashboard", "overview"]
      },
      "estimatedTime": 5,
      "difficulty": "beginner",
      "tags": ["dashboard", "data", "overview", "analytics"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=HiEIDpKqtu0"],
        "videoDurations": [283],
        "articleUrls": [],
        "aiPrompts": [
          "อธิบายว่ากราฟในแดชบอร์ด FlowAccount ดึงข้อมูลมาจากไหน",
          "ข้อมูลในแดชบอร์ดอัพเดทแบบ real-time หรือไม่"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 4:43 นาที อธิบายแหล่งข้อมูลของกราฟแดชบอร์ด"
      },
      "instructions": {
        "overview": "เรียนรู้การทำงานของระบบแดชบอร์ด FlowAccount และแหล่งที่มาของข้อมูลที่แสดง",
        "steps": [
          {
            "title": "เข้าสู่หน้าแดชบอร์ด",
            "description": "เข้าสู่ระบบ FlowAccount และไปที่หน้า Dashboard > Overview",
            "action": "navigate",
            "target": "/dashboard/overview"
          },
          {
            "title": "สังเกตกราฟต่างๆ",
            "description": "ดูกราฟทั้งหมดที่แสดงบนแดชบอร์ด ได้แก่ รายรับ-รายจ่าย, กระแสเงินสด, ลูกหนี้-เจ้าหนี้",
            "action": "review"
          },
          {
            "title": "เข้าใจแหล่งข้อมูล",
            "description": "เรียนรู้ว่าแต่ละกราฟดึงข้อมูลมาจากเอกสารประเภทใด",
            "action": "review"
          }
        ],
        "expectedResult": "เข้าใจแหล่งที่มาของข้อมูลในแดชบอร์ดและสามารถอธิบายได้ว่าข้อมูลแต่ละประเภทมาจากไหน"
      },
      "completionCriteria": {
        "type": "user_confirmation",
        "criteria": [
          {
            "field": "understanding",
            "operator": "equals",
            "expectedValue": "confirmed"
          }
        ]
      },
      "tips": [
        "ข้อมูลรายรับมาจากใบกำกับภาษี และใบเสร็จรับเงินที่ออกในระบบ",
        "ข้อมูลรายจ่ายมาจากใบกำกับภาษีซื้อและค่าใช้จ่ายที่บันทึก",
        "กราฟจะอัพเดททันทีเมื่อมีการบันทึกเอกสารใหม่"
      ],
      "status": "published"
    },
    {
      "id": "task_dashboard_002",
      "name": "สอนใช้งานโปรแกรมบัญชีออนไลน์ FlowAccount เต็มรูปแบบ",
      "englishName": "Full tutorial for using FlowAccount online accounting software",
      "description": "คู่มือการใช้งาน FlowAccount แบบครบวงจร ตั้งแต่เริ่มต้นจนถึงการใช้งานขั้นสูง",
      "category": "Dashboard",
      "featureLink": {
        "mainFeature": "dashboard",
        "subFeature": "get-started",
        "route": "/dashboard/get-started",
        "displayLocation": ["dashboard", "get-started", "overview"]
      },
      "estimatedTime": 35,
      "difficulty": "beginner",
      "tags": ["tutorial", "complete-guide", "dashboard", "getting-started"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=_hJpy2nd9dU"],
        "videoDurations": [2049],
        "articleUrls": [],
        "aiPrompts": [
          "สรุปขั้นตอนการใช้งาน FlowAccount ตั้งแต่เริ่มต้น",
          "ฟีเจอร์หลักของ FlowAccount มีอะไรบ้าง"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 34:09 นาที สอนการใช้งานแบบเต็มรูปแบบ"
      },
      "instructions": {
        "overview": "เรียนรู้การใช้งาน FlowAccount ทั้งหมดตั้งแต่การตั้งค่าเริ่มต้นจนถึงการใช้งานประจำวัน",
        "steps": [
          {
            "title": "ตั้งค่าข้อมูลบริษัท",
            "description": "เริ่มจากการตั้งค่าข้อมูลพื้นฐานของบริษัท",
            "action": "navigate",
            "target": "/settings/company"
          },
          {
            "title": "เรียนรู้ระบบเอกสาร",
            "description": "ทำความเข้าใจกับระบบเอกสารขายและซื้อ",
            "action": "review"
          },
          {
            "title": "ฝึกออกเอกสาร",
            "description": "ลองออกเอกสารขายเบื้องต้น",
            "action": "navigate",
            "target": "/sell"
          }
        ],
        "expectedResult": "สามารถใช้งาน FlowAccount ได้อย่างคล่องแคล่วในทุกฟังก์ชัน"
      },
      "completionCriteria": {
        "type": "user_confirmation",
        "criteria": []
      },
      "tips": [
        "ควรทำตามขั้นตอนในวิดีโอทีละขั้นตอน",
        "ถ้าติดปัญหาให้หยุดวิดีโอและทำตามให้เสร็จก่อนดูต่อ"
      ],
      "status": "published"
    },
    {
      "id": "task_dashboard_003",
      "name": "ก่อนเริ่มใช้งาน FlowAccount ต้องตั้งค่าอะไรบ้าง",
      "englishName": "What needs to be set up before using FlowAccount?",
      "description": "เรียนรู้การตั้งค่าพื้นฐานที่จำเป็นก่อนเริ่มใช้งาน FlowAccount",
      "category": "Dashboard",
      "featureLink": {
        "mainFeature": "dashboard",
        "subFeature": "get-started",
        "route": "/dashboard/get-started",
        "displayLocation": ["dashboard", "get-started", "settings"]
      },
      "estimatedTime": 3,
      "difficulty": "beginner",
      "tags": ["setup", "configuration", "getting-started"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=krIYN4HZ64s"],
        "videoDurations": [143],
        "articleUrls": [],
        "aiPrompts": [
          "สิ่งที่ต้องตั้งค่าก่อนใช้งาน FlowAccount",
          "ข้อมูลพื้นฐานที่จำเป็นสำหรับการใช้งาน FlowAccount"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 2:23 นาที"
      },
      "instructions": {
        "overview": "ตั้งค่าข้อมูลพื้นฐานที่จำเป็นก่อนเริ่มใช้งาน",
        "steps": [
          {
            "title": "ตั้งค่าข้อมูลบริษัท",
            "description": "กรอกข้อมูลบริษัท ที่อยู่ เลขผู้เสียภาษี",
            "action": "input",
            "target": "company-settings"
          },
          {
            "title": "ตั้งค่าเลขที่เอกสาร",
            "description": "กำหนดรูปแบบเลขที่เอกสารสำหรับเอกสารแต่ละประเภท",
            "action": "input",
            "target": "document-numbering"
          },
          {
            "title": "ตั้งค่าบัญชีธนาคาร",
            "description": "เพิ่มข้อมูลบัญชีธนาคารสำหรับการรับ-จ่ายเงิน",
            "action": "input",
            "target": "bank-accounts"
          }
        ],
        "expectedResult": "ระบบพร้อมใช้งานพร้อมข้อมูลพื้นฐานครบถ้วน"
      },
      "completionCriteria": {
        "type": "automatic",
        "criteria": [
          {
            "field": "company_info_completed",
            "operator": "equals",
            "expectedValue": true
          }
        ]
      },
      "prerequisites": ["สมัครบัญชี FlowAccount แล้ว"],
      "status": "published"
    },
    {
      "id": "task_quotation_001",
      "name": "ขายของต้องออกเอกสารอะไรใน FlowAccount",
      "englishName": "What documents do you need to issue when selling in FlowAccount?",
      "description": "เรียนรู้ประเภทเอกสารขายทั้งหมดใน FlowAccount และการเลือกใช้ให้เหมาะสม",
      "category": "Sales",
      "featureLink": {
        "mainFeature": "sell",
        "subFeature": "quotation",
        "route": "/sell/quotation",
        "displayLocation": ["sell", "quotation", "overview"]
      },
      "estimatedTime": 8,
      "difficulty": "beginner",
      "tags": ["sales", "documents", "quotation"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=GQIWk1Hmb-I"],
        "videoDurations": [456],
        "articleUrls": [
          "https://www.flowaccount.com/ultimateguide/guide/%E0%B9%83%E0%B8%9A%E0%B9%80%E0%B8%AA%E0%B8%99%E0%B8%AD%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2"
        ],
        "aiPrompts": [
          "เอกสารขายใน FlowAccount มีกี่ประเภท แต่ละประเภทใช้เมื่อไหร่",
          "ความแตกต่างระหว่างใบเสนอราคา ใบวางบิล และใบกำกับภาษี"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 7:36 นาที พร้อมคู่มือเสริม"
      },
      "instructions": {
        "overview": "ทำความเข้าใจกับเอกสารขายทุกประเภทและการใช้งานที่เหมาะสม",
        "steps": [
          {
            "title": "เรียนรู้ประเภทเอกสาร",
            "description": "ศึกษาเอกสารขายทั้ง 7 ประเภท: ใบเสนอราคา, ใบวางบิล, ใบกำกับภาษี, ใบเสร็จรับเงิน, ใบขายเงินสด, ใบลดหนี้, ใบเพิ่มหนี้",
            "action": "review"
          },
          {
            "title": "เข้าใจการใช้งาน",
            "description": "เรียนรู้ว่าควรใช้เอกสารแต่ละประเภทเมื่อไหร่",
            "action": "review"
          },
          {
            "title": "ดูตัวอย่างการใช้งาน",
            "description": "ศึกษาตัวอย่างการออกเอกสารในสถานการณ์จริง",
            "action": "review"
          }
        ],
        "expectedResult": "เข้าใจและเลือกใช้เอกสารขายได้อย่างถูกต้องตามสถานการณ์"
      },
      "completionCriteria": {
        "type": "user_confirmation",
        "criteria": []
      },
      "tips": [
        "ใบเสนอราคาใช้เสนอราคาสินค้า/บริการ ยังไม่มีผลทางภาษี",
        "ใบวางบิลใช้แจ้งหนี้ให้ลูกค้าทราบ",
        "ใบกำกับภาษีออกเมื่อส่งสินค้า/บริการแล้ว มีผลทางภาษี"
      ],
      "status": "published"
    },
    {
      "id": "task_quotation_002",
      "name": "วิธีออกใบมัดจำ",
      "englishName": "How to issue a deposit document",
      "description": "เรียนรู้วิธีการออกใบมัดจำและการจัดการเงินมัดจำในระบบ",
      "category": "Sales",
      "featureLink": {
        "mainFeature": "sell",
        "subFeature": "quotation",
        "route": "/sell/quotation",
        "displayLocation": ["sell", "quotation", "deposit"]
      },
      "estimatedTime": 3,
      "difficulty": "intermediate",
      "tags": ["deposit", "quotation", "sales"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=WmAs6p10y18"],
        "videoDurations": [179],
        "articleUrls": [
          "https://flowaccount.com/faq/knowledge-base/%e0%b8%aa%e0%b8%a3%e0%b9%89%e0%b8%b2%e0%b8%87%e0%b9%83%e0%b8%9a%e0%b8%a1%e0%b8%b1%e0%b8%94%e0%b8%88%e0%b8%b3/"
        ],
        "aiPrompts": [
          "ขั้นตอนการออกใบมัดจำใน FlowAccount",
          "การตัดเงินมัดจำเมื่อออกใบกำกับภาษี"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 2:59 นาที"
      },
      "instructions": {
        "overview": "เรียนรู้การออกใบมัดจำและการนำเงินมัดจำไปตัดในใบกำกับภาษี",
        "steps": [
          {
            "title": "สร้างใบเสนอราคา",
            "description": "เริ่มจากการสร้างใบเสนอราคาให้ลูกค้า",
            "action": "click",
            "target": "create-quotation-button"
          },
          {
            "title": "แปลงเป็นใบมัดจำ",
            "description": "จากใบเสนอราคา คลิกแปลงเป็นใบมัดจำ",
            "action": "click",
            "target": "convert-to-deposit"
          },
          {
            "title": "ระบุจำนวนเงินมัดจำ",
            "description": "กรอกจำนวนเงินมัดจำ (% หรือจำนวนเงิน)",
            "action": "input",
            "target": "deposit-amount"
          },
          {
            "title": "บันทึกและพิมพ์",
            "description": "บันทึกใบมัดจำและพิมพ์ให้ลูกค้า",
            "action": "click",
            "target": "save-button"
          }
        ],
        "expectedResult": "สามารถออกใบมัดจำและจัดการเงินมัดจำได้อย่างถูกต้อง"
      },
      "completionCriteria": {
        "type": "automatic",
        "criteria": [
          {
            "field": "deposit_document_created",
            "operator": "equals",
            "expectedValue": true
          }
        ]
      },
      "tips": [
        "สามารถกำหนดเงินมัดจำเป็นเปอร์เซ็นต์หรือจำนวนเงินได้",
        "เงินมัดจำจะถูกตัดอัตโนมัติเมื่อแปลงเป็นใบกำกับภาษี"
      ],
      "troubleshooting": [
        {
          "commonIssue": "ไม่สามารถแปลงใบเสนอราคาเป็นใบมัดจำได้",
          "solution": "ตรวจสอบว่าใบเสนอราคามีสถานะ 'อนุมัติ' แล้ว"
        }
      ],
      "status": "published"
    },
    {
      "id": "task_billingnote_001",
      "name": "ออกเอกสารขาย จัดการรายได้ ครบจบในคลิปเดียว",
      "englishName": "Issue sales documents and manage income—all in one video",
      "description": "คู่มือครบวงจรการออกเอกสารขายและการจัดการรายได้ใน FlowAccount",
      "category": "Sales",
      "featureLink": {
        "mainFeature": "sell",
        "subFeature": "billing-note",
        "route": "/sell/billing-note",
        "displayLocation": ["sell", "billing-note", "overview"]
      },
      "estimatedTime": 12,
      "difficulty": "intermediate",
      "tags": ["billing-note", "sales", "income-management"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=RWcDBZozpMY"],
        "videoDurations": [686],
        "articleUrls": [
          "https://www.flowaccount.com/ultimateguide/guide/%E0%B9%83%E0%B8%9A%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B8%9A%E0%B8%B4%E0%B8%A5-%E0%B9%83%E0%B8%9A%E0%B9%81%E0%B8%88%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%99%E0%B8%B5%E0%B9%89"
        ],
        "aiPrompts": [
          "ขั้นตอนการออกใบวางบิลใน FlowAccount",
          "การจัดการรายได้จากใบวางบิล"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 11:26 นาที"
      },
      "instructions": {
        "overview": "เรียนรู้การออกเอกสารขายทั้งหมดและการจัดการรายได้อย่างเป็นระบบ",
        "steps": [
          {
            "title": "เข้าหน้าใบวางบิล",
            "description": "ไปที่เมนู ขาย > ใบวางบิล/ใบแจ้งหนี้",
            "action": "navigate",
            "target": "/sell/billing-note"
          },
          {
            "title": "สร้างใบวางบิล",
            "description": "คลิกปุ่ม 'สร้างใบวางบิล' และกรอกข้อมูล",
            "action": "click",
            "target": "create-billing-note"
          },
          {
            "title": "จัดการรายได้",
            "description": "ดูภาพรวมรายได้จากใบวางบิลในหน้า Dashboard",
            "action": "navigate",
            "target": "/dashboard/accounts-receivable"
          }
        ],
        "expectedResult": "สามารถออกใบวางบิลและติดตามรายได้ได้อย่างมีประสิทธิภาพ"
      },
      "completionCriteria": {
        "type": "user_confirmation",
        "criteria": []
      },
      "status": "published"
    },
    {
      "id": "task_taxinvoice_001",
      "name": "เชื่อมต่อ e-Tax invoice by Time Stamp",
      "englishName": "Connect and send e-Tax invoice by Time Stamp",
      "description": "เรียนรู้การเชื่อมต่อและส่งใบกำกับภาษีอิเล็กทรอนิกส์ผ่านระบบ Time Stamp",
      "category": "Sales",
      "featureLink": {
        "mainFeature": "sell",
        "subFeature": "tax-invoice",
        "route": "/sell/tax-invoice",
        "displayLocation": ["sell", "tax-invoice", "e-tax"]
      },
      "estimatedTime": 4,
      "difficulty": "advanced",
      "tags": ["e-tax", "tax-invoice", "integration"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=IZQl4ZK5bx0"],
        "videoDurations": [190],
        "articleUrls": [
          "https://flowaccount.com/faq/knowledge-base/e-tax-invoice-by-time-stamp/"
        ],
        "aiPrompts": [
          "ขั้นตอนการเชื่อมต่อ e-Tax Invoice",
          "ข้อดีของการใช้ e-Tax Invoice"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 3:10 นาที"
      },
      "instructions": {
        "overview": "ตั้งค่าและใช้งาน e-Tax Invoice by Time Stamp",
        "steps": [
          {
            "title": "เข้าหน้าตั้งค่า",
            "description": "ไปที่ Settings > Document > e-Tax Invoice",
            "action": "navigate",
            "target": "/settings/document/e-tax"
          },
          {
            "title": "เชื่อมต่อ API",
            "description": "กรอก API Key จากระบบ Time Stamp",
            "action": "input",
            "target": "api-key-field"
          },
          {
            "title": "ทดสอบการส่ง",
            "description": "สร้างใบกำกับภาษีทดสอบและส่งผ่านระบบ",
            "action": "click",
            "target": "test-send-button"
          }
        ],
        "expectedResult": "สามารถส่งใบกำกับภาษีอิเล็กทรอนิกส์ผ่านระบบได้สำเร็จ"
      },
      "completionCriteria": {
        "type": "automatic",
        "criteria": [
          {
            "field": "e_tax_connected",
            "operator": "equals",
            "expectedValue": true
          }
        ]
      },
      "prerequisites": ["task_taxinvoice_basic", "มี API Key จาก Time Stamp"],
      "tips": [
        "ต้องมีแพ็กเกจที่รองรับ e-Tax Invoice",
        "ตรวจสอบข้อมูลบริษัทให้ครบถ้วนก่อนเชื่อมต่อ"
      ],
      "status": "published"
    },
    {
      "id": "task_mobile_001",
      "name": "ใครถนัดใช้แอปมือถือมากกว่า มาดูวิธีใช้งานที่วิดีโอนี้",
      "englishName": "For those who prefer mobile apps, see how to use it in this video",
      "description": "คู่มือการใช้งาน FlowAccount บนแอปพลิเคชันมือถือ",
      "category": "Mobile",
      "featureLink": {
        "mainFeature": "mobile",
        "subFeature": "all",
        "route": "mobile-app",
        "displayLocation": ["dashboard", "mobile", "all-features"]
      },
      "estimatedTime": 18,
      "difficulty": "beginner",
      "tags": ["mobile", "app", "ios", "android"],
      "contentAttachments": {
        "videoUrls": ["https://www.youtube.com/watch?v=FpKmzY2DH_4"],
        "videoDurations": [1022],
        "articleUrls": [],
        "aiPrompts": [
          "ฟีเจอร์ที่ใช้ได้บนแอปมือถือ FlowAccount",
          "ความแตกต่างระหว่างเวอร์ชันเว็บและมือถือ"
        ],
        "articleTitles": [],
        "aiContexts": [],
        "resourceUrls": [],
        "resourceDescriptions": [],
        "attachmentNotes": "วิดีโอความยาว 17:02 นาที"
      },
      "instructions": {
        "overview": "เรียนรู้การใช้งาน FlowAccount บนมือถือทั้งระบบ iOS และ Android",
        "steps": [
          {
            "title": "ดาวน์โหลดแอป",
            "description": "ดาวน์โหลด FlowAccount จาก App Store หรือ Play Store",
            "action": "navigate",
            "target": "app-store"
          },
          {
            "title": "เข้าสู่ระบบ",
            "description": "ใช้บัญชีเดียวกับเว็บไซต์",
            "action": "input",
            "target": "login-credentials"
          },
          {
            "title": "สำรวจฟีเจอร์",
            "description": "ทดลองใช้ฟีเจอร์ต่างๆ บนแอป",
            "action": "review"
          }
        ],
        "expectedResult": "สามารถใช้งาน FlowAccount บนมือถือได้คล่องแคล่ว"
      },
      "completionCriteria": {
        "type": "user_confirmation",
        "criteria": []
      },
      "tips": [
        "แอปมือถือเหมาะสำหรับการดูรายงานและออกเอกสารด่วน",
        "บางฟีเจอร์ขั้นสูงอาจต้องใช้เวอร์ชันเว็บ",
        "สามารถถ่ายรูปใบเสร็จเพื่อบันทึกค่าใช้จ่ายได้ทันที"
      ],
      "status": "published"
    }
  ]
};

/**
 * Import all draft tasks into the content management system
 */
export async function importDraftTasks(
  learningContentService: LearningContentService
): Promise<void> {
  console.log('Starting import of draft tasks...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const taskData of DRAFT_TASKS_DATA.tasks) {
    try {
      console.log(`Importing task: ${taskData.name}`);
      
      // Transform and create the task using LearningContentService
      await learningContentService.createTask({
        name: taskData.name,
        description: taskData.description,
        outcome: `เป็นผู้ใช้ที่มีความรู้เรื่อง ${taskData.name}`, // Default outcome if not provided
        estimatedTime: taskData.estimatedTime,
        difficulty: taskData.difficulty as any,
        category: taskData.category,
        tags: taskData.tags,
        featureLink: taskData.featureLink,
        contentAttachments: taskData.contentAttachments,
        instructions: {
          overview: taskData.instructions.overview,
          steps: taskData.instructions.steps.map((step: any, index: number) => ({
            stepNumber: step.stepNumber || index + 1,
            title: step.title,
            description: step.description,
            action: step.action as any,
            target: step.target
          })),
          expectedResult: taskData.instructions.expectedResult
        },
        completionCriteria: {
          type: taskData.completionCriteria.type as any,
          criteria: taskData.completionCriteria.criteria.map((criteria: any) => ({
            field: criteria.field,
            operator: criteria.operator as any,
            expectedValue: criteria.expectedValue
          }))
        },
        tips: taskData.tips,
        troubleshooting: taskData.troubleshooting?.map((tip: any) => ({
          commonIssue: tip.commonIssue,
          solution: tip.solution,
          severity: tip.severity || 'medium' as any
        })),
        prerequisites: taskData.prerequisites,
        status: taskData.status as any
      });
      
      successCount++;
      console.log(`✅ Successfully imported: ${taskData.name}`);
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to import ${taskData.name}:`, error);
    }
  }
  
  console.log(`\n🎉 Import completed!`);
  console.log(`✅ Successfully imported: ${successCount} tasks`);
  console.log(`❌ Failed to import: ${errorCount} tasks`);
}

/**
 * Utility function to call from console or component
 */
export function executeDraftTasksImport(): void {
  // This would typically be called from a component with proper injection
  console.log('To import draft tasks, call importDraftTasks(learningContentService) from a component');
}