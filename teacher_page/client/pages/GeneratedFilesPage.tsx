import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileQuestion,
  FileText,
  Gamepad2,
  Layers3,
  Music2,
  Presentation,
  Save,
  Video,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveLessonToStorage, createLessonId, formatDate, type SavedLesson } from "@/utils/lessonStorage";

type Draft = {
  planName: string;
  major: string;
  subject: string;
  unit: string;
  topic: string;
  notes: string;
  lessonContent?: string;
};

const draftStorageKey = "lessonPlanGenerationDraft";

const getDraftFromStorage = (): Draft => {
  if (typeof window === "undefined") return { planName: "", major: "", subject: "", unit: "", topic: "", notes: "" };

  try {
    const raw = window.sessionStorage.getItem(draftStorageKey);
    if (!raw) return { planName: "", major: "", subject: "", unit: "", topic: "", notes: "" };

    return JSON.parse(raw) as Draft;
  } catch {
    return { planName: "", major: "", subject: "", unit: "", topic: "", notes: "" };
  }
};

const timeLessonSelection = {
  subject: "คณิตศาสตร์",
  grade: "ประถมศึกษาปีที่ 2",
  unit: "เวลา",
  topic: "เวลาและการบอกเวลาเป็นนาฬิกา",
};

const scienceLessonSelection = {
  subject: "วิทยาศาสตร์และเทคโนโลยี",
  grade: "ประถมศึกษาปีที่ 1",
  unit: "ตัวเรา",
  topic: "ร่างกายของฉัน",
};

const englishLessonSelection = {
  subject: "ภาษาอังกฤษ",
  grade: "ประถมศึกษาปีที่ 4",
  unit: "My House",
  topic: "In my house",
};

const electricalLessonSelection = {
  major: "ช่างไฟฟ้า",
  subject: "วงจรไฟฟ้ากระแสสลับ / AC Electric Circuits",
  unit: "1. ไฟฟ้ากระแสสลับ",
  topic: "1. หลักการเกิดไฟฟ้ากระแสสลับ",
};

const electronicsLessonSelection = {
  major: "อิเล็กทรอนิกส์",
  subject: "อุปกรณ์อิเล็กทรอนิกส์และวงจร / Electronics Devices and Circuits",
  unit: "1. อะตอมและสารกึ่งตัวนำ",
  topic: "1. โครงสร้างอะตอม",
};

const featuredVideoUrl = "https://cdn.builder.io/o/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2F1b7e4246a12140ac8aa0fa8fce0588cd%2Fcompressed?apiKey=a061ccedc21643e89c15d64ceb68a9d5&token=1b7e4246a12140ac8aa0fa8fce0588cd&alt=media&optimized=true";
const featuredSlidesLessonUrl = "https://gamma.app/docs/-1espdvgbswhkp9h?mode=doc";
const featuredSlidesActivityUrl = "https://gamma.app/docs/-lvdq9fga1x8pl1z?mode=doc";
const featuredQuizUrl = "https://example.com/quiz/math";
const featuredGameUrl = "https://game-quiz-race-client.onrender.com/quizrace";
const featuredPlanDocxUrl = "https://cdn.builder.io/o/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2F53615fcbc8d94005bf91d1a8d8587a4b?alt=media&token=4dd390ad-2424-4786-b90e-35f8367e65e6&apiKey=a061ccedc21643e89c15d64ceb68a9d5";
const featuredSongDownloadUrl = "https://cdn.builder.io/o/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2Feab0b9de30b642ffbf9f9a769536b92f?alt=media&token=8e1625ac-8b26-4155-9633-54684726e0aa&apiKey=a061ccedc21643e89c15d64ceb68a9d5";
const featuredSongDownloadName = "นาฬิกาและนาที.mp3";

// Time lesson assets
const timeContentUrl = "https://docs.google.com/document/d/1xyqywLipx4Au6_mDB3pKeibk5sdAeTRP/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const timePlanUrl = "https://docs.google.com/document/d/10Wpk1I4-l8wH2hsUpXVK-8HyLta6Jit9/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const timeVideoUrl = "https://drive.google.com/file/d/12RFmocW6K-w1WDXO7_v-ejsOl4l8byqE/view?usp=sharing";
const timeSongUrl = "https://drive.google.com/file/d/1tjTOUY7GDXJ43OVb6jxYOVizxgqsXS9B/view?usp=sharing";
const timeSlidesLessonUrl = "https://docs.google.com/presentation/d/1IZ6tnzmFxrz2nz7dxmFWDM12seVEyonb/edit?usp=drive_link&ouid=113859264124309761899&rtpof=true&sd=true";
const timeSlidesActivityUrl = "https://docs.google.com/presentation/d/1vDl1gCir64l7AT5VOKSqvKifC8HjRt5e/edit?usp=drive_link&ouid=113859264124309761899&rtpof=true&sd=true";
const timeSlidesLessonGammaUrl = "https://gamma.app/docs/-1espdvgbswhkp9h?mode=doc";
const timeSlidesActivityGammaUrl = "https://gamma.app/docs/-lvdq9fga1x8pl1z?mode=doc";
const timeExamUrl = "https://docs.google.com/document/d/1lYbdqXcWwJu5NkdIazaKc_PLms6crJbu/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const timeAnswerUrl = "https://docs.google.com/document/d/11q5ZvO2ViZk4yORr6vSsafP-nOGOf5CL/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";

// Science lesson assets
const scienceContentUrl = "https://docs.google.com/document/d/1-UftpxKnGdClsnlKCO2JuXruID9SCRpH/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const sciencePlanUrl = "https://docs.google.com/document/d/1fpPDF22GgQH1zXNH6PAee2hfAIGZ8S9E/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const scienceVideoUrl = "https://drive.google.com/file/d/1DipJGWY0ca9d5ZVY_8k4XFe4q7vZwvay/view?usp=sharing";
const scienceSongUrl = "https://drive.google.com/file/d/1PvDk2VS3gHKpxtecyNotToRdmIY6XGHD/view?usp=drive_link";
const scienceSlidesLessonUrl = "https://docs.google.com/presentation/d/1n7nQSCCsosIN_j6n8tbtmg51UQEVCg3f/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const scienceSlidesActivityUrl = "https://docs.google.com/presentation/d/1fo1T-NLgJ0jQlHydUZWjrAPL2IbFkcht/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const scienceSlidesLessonGammaUrl = "https://gamma.app/docs/-mt7hwpwnbx3l39b?mode=doc";
const scienceSlidesActivityGammaUrl = "https://gamma.app/docs/-kbyo9n5c7842esm?mode=doc";
const scienceExamUrl = "https://docs.google.com/document/d/1AFV0ipBjzJjA54dgiVmjkNBRDeNqbEUJ/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const scienceAnswerUrl = "https://docs.google.com/document/d/1JRJAR_aEpvzlSMWvcp_mfVqSQmGphr_D/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";

// English lesson assets
const englishContentUrl = "https://docs.google.com/document/d/1xHF9BOK96CPxFmVFevL13CJMn-m7HEPh/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const englishPlanUrl = "https://docs.google.com/document/d/1tAUJQ5vjpEUQoNcGoZDaoEnJoyfhpoUx/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const englishVideoUrl = "https://drive.google.com/file/d/1kqwB5VgPUqAnmy3UbQxYUayB2B_7RCJd/view?usp=drive_link";
const englishSongUrl = "https://drive.google.com/file/d/1X6ElMGkHzf2j10UBmN_dO_xse4JPrGU7/view?usp=drive_link";
const englishSlidesLessonUrl = "https://docs.google.com/presentation/d/1_-NA3W9oi-DBMw_mKVRyoLHZW0HCB6e2/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const englishSlidesActivityUrl = "https://docs.google.com/presentation/d/1Kp13zd8UajakuTJFFvKfzJHZhf-8hUYQ/edit?usp=drive_link&ouid=113859264124309761899&rtpof=true&sd=true";
const englishSlidesLessonGammaUrl = "https://gamma.app/docs/In-My-House-Where-is-it-nseoqo5o9836tf1?mode=doc";
const englishSlidesActivityGammaUrl = "https://gamma.app/docs/In-My-House-qcav18xvjihpejf?mode=doc";
const englishExamUrl = "https://docs.google.com/document/d/1SfdnYTPLsp-I3y0WaZAyD7obiTOjTewO/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const englishAnswerUrl = "https://docs.google.com/document/d/133LzmTA7t3v2InKbG5p0AEZCTDcOXn8u/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";

// Electrical lesson assets
const electricalContentUrl = "https://docs.google.com/document/d/1ODKwSwfvfuM-kFBLG_tYWvspe6pPdIjF/edit?usp=sharing&ouid=116602784993741191970&rtpof=true&sd=true";
const electricalPlanUrl = "https://docs.google.com/document/d/1T16-gv3s5FmwdHsEvvB75uiPJQHzoGzu/edit?usp=sharing&ouid=116602784993741191970&rtpof=true&sd=true";
const electricalVideoUrl = "https://drive.google.com/file/d/1KLgXkX62RKGXvxy9UHAyVVLc9Q0B58k8/view?usp=sharing";
const electricalSlidesLessonUrl = "https://docs.google.com/presentation/d/1akOs4A6ivcvchDwgHCIjWP3tX0rE3EqN/edit?usp=sharing&ouid=116602784993741191970&rtpof=true&sd=true";
const electricalSlidesActivity1Url = "https://docs.google.com/presentation/d/1BAtKhiZO13s804AKHHJaj8h3xm4_hKEa/edit?usp=sharing&ouid=116602784993741191970&rtpof=true&sd=true";
const electricalExamUrl = "https://docs.google.com/document/d/19jKSAtkr4y5vHmz9wPyapREQrmUdfIfk/edit?usp=sharing&ouid=116602784993741191970&rtpof=true&sd=true";
const electricalAnswerUrl = "https://docs.google.com/document/d/1iix4wIk_ri4zXv5zKMUX9H-Wxn4VrHUA/edit?usp=sharing&ouid=116602784993741191970&rtpof=true&sd=true";
const electricalQrUrl = "https://drive.google.com/file/d/1v4E0ZE6Fk81Hgnx-U1HiJydQNJar8c05/view?usp=sharing";

// Electrical lesson assets - Format 2 (Story-based)
const electricalContent2Url = "https://docs.google.com/document/d/1U6EHIWeflnc684FRxoSxrN0l35Pbqdyu/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electricalPlan2Url = "https://docs.google.com/document/d/1U6EHIWeflnc684FRxoSxrN0l35Pbqdyu/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electricalVideo2Url = "https://drive.google.com/file/d/1YSoBctt0u-1quRAGjrKW6OpJOgrK3MTK/view?usp=sharing";
const electricalSlidesLesson2Url = "https://docs.google.com/presentation/d/1AWr3EcAqj0twbATLhqK2T4UpeYB7UN06/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electricalSlidesActivity2Url = "https://docs.google.com/presentation/d/1aIwOf-WdlOVDUwyXpzxFXEjPs_pIM8TJ/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electricalExam2Url = "https://docs.google.com/document/d/19jKSAtkr4y5vHmz9wPyapREQrmUdfIfk/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electricalAnswer2Url = "https://docs.google.com/document/d/19jKSAtkr4y5vHmz9wPyapREQrmUdfIfk/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electricalQr2Url = "https://drive.google.com/file/d/1v4E0ZE6Fk81Hgnx-U1HiJydQNJar8c05/view?usp=sharing";

// Electronics lesson assets - Format 1 (Academic)
const electronicsContentUrl = "https://docs.google.com/document/d/1YkB2iLC4BLqcvTTCrycHCkbiCMD6oED5/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsPlan1Url = "https://docs.google.com/document/d/1lw2k85jv2rc_qGnPF5muF27ccQ9KjeHz/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsPlan2Url = "https://docs.google.com/document/d/1zMruGvL1OQPp3WWWFKAVkXId4_ISA2tZ/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsVideoUrl = "https://drive.google.com/file/d/1Ht3-cJYQlG_zL-UmkMNGvhs7lQXL1vyi/view?usp=sharing";
const electronicsSlidesLessonUrl = "https://docs.google.com/presentation/d/1hHYeW0enwGUBweGBIe7j6xg-kCmf6rAK/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsSlidesActivity1Url = "https://docs.google.com/presentation/d/1XpATT4noRB4Rb0NTw6k3gEAVBDeurofZ/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsSlidesActivity2Url = "https://docs.google.com/presentation/d/129DVHwdaGfNagvDvR9I5pG1Af5GtOYDt/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsExamUrl = "https://docs.google.com/document/d/1q6fKgSDOWI5NNsuB_9q94S6hhG2ooFfd/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsQrUrl = "https://drive.google.com/file/d/1Ednv8LOxUj-h32M0aeaHNm5-Kl8Hwnrd/view?usp=sharing";

// Electronics lesson assets - Format 2 (Story-based)
const electronicsContent2Url = "https://docs.google.com/document/d/1kjP5JHGpkTtuvjE5d6mpSYphReEE4h-6/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
const electronicsVideo2Url = "https://drive.google.com/file/d/1WCZJIKTfqO11qhlQHaTC03fr5Jp5WPI9/view?usp=sharing";
const electronicsSlidesLesson2Url = "https://docs.google.com/presentation/d/17fyee51rlzZ5DfccpdJKlQq5jmIyDicO/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";

const timeContent = `นาฬิกาคือเพื่อนที่บอกเวลาให้เรา
ลองนึกภาพว่าเราตื่นนอนตอนเช้า มองไปที่นาฬิกาบนผนังห้อง แล้วรู้ทันทีเลยว่าตอนนี้กี่โมง นาฬิกานั้นช่างมีประโยชน์มากเลยใช่ไหมล่ะ วันนี้เราจะมาทำความรู้จักกับนาฬิกาให้ดียิ่งขึ้น เพื่อที่เราจะได้อ่านเวลาได้เองโดยไม่ต้องถามใคร
เวลา คือสิ่งที่เราใช้วัดว่าแต่ละเหตุการณ์เกิดขึ้นเมื่อไหร่ และนานแค่ไหน หน่วยที่เราใช้วัดเวลาที่สำคัญมี 2 อย่าง นั่นคือ ชั่วโมง กับ นาที โดย 1 ชั่วโมง จะเท่ากับ 60 นาที เหมือนกับว่าถ้าเราดูภาพยนตร์การ์ตูนเรื่องหนึ่งนาน 60 นาที ก็แปลว่าเราใช้เวลา 1 ชั่วโมงพอดี
เข็มสั้นและเข็มยาว สองเพื่อนบนหน้าปัด
บนหน้าปัดนาฬิกามีเข็มอยู่ 2 ตัว ตัวแรกคือ เข็มสั้น ซึ่งเป็นเข็มที่เคลื่อนที่ช้ากว่า มีหน้าที่บอกเราว่าตอนนี้กี่ชั่วโมงแล้ว ส่วนตัวที่สองคือ เข็มยาว ซึ่งวิ่งเร็วกว่า มีหน้าที่บอกว่าตอนนี้กี่นาทีแล้ว

เคล็ดลับง่าย ๆ ในการจำ: เข็มสั้นบอกชั่วโมง เข็มยาวบอกนาที เวลาอ่านนาฬิกาให้มองเข็มสั้นก่อนเสมอ แล้วค่อยมองเข็มยาว
ลองนึกถึงตอนที่เราตื่นนอนไปโรงเรียน ถ้าเข็มสั้นชี้อยู่ที่เลข 7 และเข็มยาวชี้อยู่ที่เลข 12 แบบนี้เรียกว่า 7 นาฬิกาตรง หรือเรียกง่าย ๆ ว่า โมงเช้า เจ็ดโมงเช้านั่นเอง ซึ่งถ้านาฬิกาบอกเวลาแบบนี้ ก็หมายความว่าถึงเวลาแต่งตัวไปโรงเรียนได้แล้ว

วิธีนับนาทีบนหน้าปัดนาฬิกา
ตัวเลขบนหน้าปัดนาฬิกามี 12 ตัว เรียงอยู่รอบวง และในแต่ละช่องระหว่างตัวเลขสองตัวที่อยู่ติดกันแทนค่า 5 นาที ดังนั้นถ้าเราอยากรู้ว่าเข็มยาวชี้อยู่กี่นาที ให้ลองนับทีละ 5 จากเลข 12 ไปเรื่อย ๆ ตามเข็มนาฬิกาจนถึงตำแหน่งที่เข็มยาวชี้อยู่

ตัวอย่างชีวิตจริง: เพื่อนบอกว่าจะมารับที่บ้านตอน 3 นาฬิกา 15 นาที เราก็มองนาฬิกา เห็นว่าเข็มสั้นชี้ที่ 3 และเข็มยาวชี้ที่ 3 (นับได้ว่า 5, 10, 15) เราก็รู้เลยว่าเพื่อนจะมาในเวลานี้
เมื่อเราฝึกอ่านนาฬิกาบ่อย ๆ เราจะรู้สึกว่ามันเป็นเรื่องง่ายมาก เหมือนกับการที่เราฝึกขี่จักรยานจนชำนาญ แรก ๆ อาจดูยากนิดหน่อย แต่พอทำบ่อย ๆ ก็จะทำได้เองโดยอัตโนมัติ
เวลาในชีวิตประจำวันของเรา
ลองมาดูกันว่าในหนึ่งวัน เราใช้ความรู้เรื่องเวลาในสถานการณ์ไหนบ้าง ตอนเช้าเราตื่นนอนแล้วมองนาฬิกาเพื่อรู้ว่ายังมีเวลาอาบน้ำก่อนไปโรงเรียนอีกไหม ในห้องเรียนเราดูตารางเรียนเพื่อรู้ว่าวิชาต่อไปคืออะไรและเริ่มกี่โมง ตอนเย็นเราดูเวลาเพื่อรู้ว่ายังมีเวลาเล่นก่อนทำการบ้านได้อีกกี่นาที

ตัวอย่างการเรียงลำดับกิจกรรม: ตื่นนอน 6 นาฬิกา 30 นาที → อาบน้ำ 6 นาฬิกา 45 นาที → กินข้าว 7 นาฬิกา 00 นาที → ออกเดินทาง 7 นาฬิกา 30 นาที กิจกรรมที่มีเวลาน้อยกว่าจะเกิดขึ้นก่อนเสมอ
ดังนั้นการรู้จักบอกเวลาและเรียงลำดับเวลาได้จึงไม่ใช่แค่เรื่องของการเรียนคณิตศาสตร์เท่านั้น แต่ยังเป็นทักษะที่ช่วยให้ชีวิตของเราเป็นระเบียบและราบรื่นมากขึ้นด้วย`;
const featuredSongLyrics = `[Intro]
นาฬิกา นาฬิกา เพื่อนรักของเรา
บอกเวลา บอกเวลา ให้เราได้รู้

[Verse 1]
เข็มสั้นบอกชั่วโมง เข็มยาวบอกนาที
มองเข็มสั้นก่อนนะ แล้วค่อยมองเข็มยาว
หนึ่งชั่วโมงเท่ากับ หกสิบนาทีพอดี
จำไว้ให้ดีนะ จำไว้ให้ดี

[Chorus]
เข็มสั้น เข็มสั้น บอกชั่วโมง
เข็มยาว เข็มยาว บอกนาที
นับทีละห้า ห้า สิบ สิบห้า
อ่านนาฬิกาได้แล้ว เย้!

เข็มสั้น เข็มสั้น บอกชั่วโมง
เข็มยาว เข็มยาว บอกนาที
นับทีละห้า ห้า สิบ สิบห้า
อ่านนาฬิกาเก่งแล้ว เย้!`;

const scienceContent = `ตอนที่ 1 — เปิดเรื่อง
วันนี้เราจะมาทำความรู้จักกับสิ่งที่อยู่กับเราตลอดเวลา นั่นก็คือ "ร่างกายของเราเอง" ลองดูมือของตัวเองซิ เห็นไหมว่ามีนิ้วมือ 5 นิ้ว แต่ละนิ้วโค้งงอได้ หยิบจับได้ เขียนได้ น่าทึ่งมากใช่ไหม?
ร่างกายของเราแบ่งออกเป็น 4 ส่วนใหญ่ ๆ ได้แก่ ศีรษะ ลำตัว แขน และขา แต่ละส่วนมีชื่อเรียกและมีงานที่ต้องทำเป็นของตัวเอง เหมือนกับสมาชิกในครอบครัวที่ต่างคนต่างมีหน้าที่ แต่ทุกคนก็ช่วยกันทำให้บ้านเดินหน้าต่อไปได้

ตอนที่ 2 — รู้จักศีรษะ
ส่วนแรกที่เราจะรู้จักคือ "ศีรษะ" ซึ่งอยู่บนสุดของร่างกาย ถ้าให้เปรียบก็เหมือนหัวหน้าทีมที่คอยออกคำสั่งให้ทุกส่วนของร่างกายทำงาน เพราะภายในศีรษะมีสมองซึ่งทำหน้าที่ควบคุมการทำงานทั้งหมด
บนศีรษะมีเพื่อนสนิทหลายคน ได้แก่ ตา 2 ข้าง ที่ช่วยให้เรามองเห็นสีสัน ระยะทาง และสิ่งต่าง ๆ รอบตัว หู 2 ข้าง ที่ช่วยให้เราได้ยินเสียงเพลง เสียงครู และเสียงรถ จมูก 1 อัน ที่ช่วยให้เรารู้ว่าดอกไม้หอม อาหารหอม หรือน้ำเหม็น และปาก 1 อัน ที่ช่วยให้เรากินข้าว พูดคุย หัวเราะ และร้องเพลงได้ ในปากยังมีฟันที่ช่วยบดเคี้ยวอาหาร และลิ้นที่ช่วยให้เราลิ้มรสอาหารว่าหวาน เปรี้ยว เค็ม หรือขมอีกด้วย

ตอนที่ 3 — รู้จักลำตัว แขน และขา
ส่วนต่อมาคือ "ลำตัว" ซึ่งอยู่กลางร่างกาย เป็นที่อยู่ของอวัยวะสำคัญภายใน เช่น หัวใจที่สูบฉีดเลือด และปอดที่ช่วยให้เราหายใจ ถ้าลองวางมือที่หน้าอกซ้าย เราจะรู้สึกได้ว่าหัวใจกำลังเต้นอยู่ตลอดเวลา
"แขน" ทั้ง 2 ข้างของเราคือผู้ช่วยที่ขยันที่สุด แขนและมือช่วยให้เราหยิบดินสอ เขียนหนังสือ วาดรูป โอบกอดคนที่เรารัก และยกของได้ ลองกำนิ้วมือแล้วแบมือออก เราสามารถควบคุมนิ้วแต่ละนิ้วได้อย่างอิสระเลย
"ขา" ทั้ง 2 ข้างทำหน้าที่รับน้ำหนักทั้งหมดของร่างกายและพาเราไปในที่ต่าง ๆ เราใช้ขาเดิน วิ่ง กระโดด เตะลูกบอล และเหยียบปั่นจักรยาน เท้าของเราก็ช่วยทรงตัวให้เราไม่ล้มนะ

ตอนที่ 4 — ร่างกายทำงานร่วมกัน
ตอนนี้ลองนึกภาพว่าเรากำลังรับประทานอาหารกลางวัน ตาเราจะมองเห็นจานข้าว จมูกเราจะได้กลิ่นอาหารหอม ปากเราจะอ้าออก มือเราจะหยิบช้อน แขนเราจะยกช้อนเข้าปาก ฟันเราจะเคี้ยวอาหาร และลิ้นเราจะรับรสชาติ เห็นไหมว่ากิจกรรมง่าย ๆ อย่างการกินข้าวก็ต้องใช้ส่วนต่าง ๆ ของร่างกายหลายส่วนทำงานพร้อมกัน
เหมือนกับวงดนตรีที่ทุกคนต้องบรรเลงพร้อมกัน ถ้าขาดคนใดคนหนึ่ง เพลงก็จะไม่ไพเราะ ร่างกายของเราก็เช่นกัน ทุกส่วนต่างมีความสำคัญและต้องช่วยกัน

การนำไปใช้ในชีวิตประจำวัน
เมื่อเรารู้จักส่วนต่าง ๆ ของร่างกายแล้ว เราก็จะดูแลร่างกายได้ดีขึ้น เช่น รู้ว่าต้องล้างมือก่อนกินข้าวเพราะมือสัมผัสสิ่งของมากมาย แปรงฟันทุกวันเพราะฟันช่วยบดเคี้ยวอาหาร ล้างตาหากมีฝุ่นเข้า และยืดแขนยืดขาหลังนั่งนาน นอกจากนี้ เมื่อเราเจ็บปวดที่ส่วนใด เราก็จะบอกคุณพ่อคุณแม่หรือครูได้ถูกต้อง เช่น "หนูเจ็บที่ข้อเข่า" หรือ "หนูปวดหัว" ซึ่งช่วยให้ผู้ใหญ่ช่วยเราได้เร็วขึ้น`;

const scienceSongLyrics = `[Intro]
ร่างกายของเรา มีสี่ส่วนใหญ่
มาร้องตามกัน ให้ใจจดจำ

[Verse 1]
ศีรษะอยู่บน มีตา หู จมูก ปาก
ตามองเห็นสิ่ง หูฟังเสียงดัง
จมูกดมกลิ่น ปากพูดและกิน
สมองในหัว คอยสั่งทุกอย่าง

[Chorus]
ศีรษะ ลำตัว แขน และขา
ทุกส่วนทำงาน ร่วมกันทุกเวลา
ศีรษะ ลำตัว แขน และขา
ร่างกายเราดี เพราะมีทุกส่วน

[Verse 2]
แขนและมือเรา หยิบจับเขียนได้
ขาพาเราเดิน วิ่งเล่นได้ไกล
ลำตัวตรงกลาง หัวใจเต้นตุ้บ
ปอดช่วยหายใจ ทุกวันทุกคืน

[Chorus]
ศีรษะ ลำตัว แขน และขา
ทุกส่วนทำงาน ร่วมกันทุกเวลา
ศีรษะ ลำตัว แขน และขา
ร่างกายเราดี เพราะมีทุกส่วน

[Outro]
ดูแลร่างกาย ให้แข็งแรงไว้
ทุกส่วนสำคัญ อย่าลืมนะเรา`;

const englishContent = `ลองนึกภาพห้องนอนของเราสักครู่หนึ่ง บนโต๊ะอาจมีหนังสือเรียนวางอยู่ ในลิ้นชักอาจมีดินสอซุกอยู่ข้างใน และใต้เตียงอาจมีรองเท้าหายไปโดยที่เราไม่รู้ตัว เวลาเราอยากบอกให้คนอื่นรู้ว่าของชิ้นไหนอยู่ที่ไหน เราก็ต้องใช้คำที่ช่วยบอกตำแหน่ง ในภาษาอังกฤษ คำเหล่านั้นเรียกว่า Prepositions of Place หรือ คำบุพบทบอกตำแหน่ง นั่นเอง วิธีพูดง่ายๆ ก็คือใช้โครงสร้าง "The [สิ่งของ] is [คำบอกตำแหน่ง] the [สถานที่]." ยกตัวอย่างเช่น ถ้าหนังสืออยู่บนโต๊ะ เราพูดว่า "The book is on the table." ถ้าแมวซ่อนอยู่ใต้เก้าอี้ เราพูดว่า "The cat is under the chair." ถ้ากระเป๋าวางอยู่ข้างๆ ประตู เราพูดว่า "The bag is next to the door." และถ้าโทรทัศน์อยู่ตรงหน้าโซฟา เราพูดว่า "The TV is in front of the sofa." เห็นไหมว่าไม่ยากเลย เพราะทุกประโยคมีแบบเดียวกันหมด แค่เปลี่ยนชื่อสิ่งของและเปลี่ยนคำบอกตำแหน่งให้เหมาะกับสิ่งที่เราเห็น คำบุพบทบอกตำแหน่งที่ควรจำในชีวิตประจำวัน ได้แก่ on (บน), in (ใน), under (ใต้), next to (ข้างๆ), behind (ข้างหลัง) และ in front of (ข้างหน้า) ลองสังเกตสิ่งของรอบๆ ตัวในห้องเรียนหรือที่บ้านวันนี้ แล้วลองพูดเป็นภาษาอังกฤษดูว่าของแต่ละชิ้นอยู่ที่ไหน เพราะนี่คือทักษะที่เราใช้ได้จริงทุกวัน ไม่ว่าจะเป็นการบอกทางให้เพื่อน การอธิบายที่อยู่ของสิ่งของที่หาย หรือแม้แต่การเขียนรายงานภาษาอังกฤษในอนาคต

Imagine your own bedroom for a moment. There might be a textbook sitting on your desk, a pencil tucked inside a drawer, and a pair of shoes hiding under your bed without you even realising it. Whenever we want to tell someone where something is, we need words that describe position. In English, these words are called Prepositions of Place. The simple way to use them is with the structure "The [object] is [preposition] the [place]." For example, if a book is resting on a table, we say "The book is on the table." If a cat is hiding under a chair, we say "The cat is under the chair." If a bag is placed beside a door, we say "The bag is next to the door." And if a television is positioned in front of a sofa, we say "The TV is in front of the sofa." As you can see, it is not difficult at all, because every sentence follows the same pattern — we simply change the name of the object and choose the preposition that matches what we observe. The prepositions of place that are most useful in everyday life are on (บน), in (ใน), under (ใต้), next to (ข้างๆ), behind (ข้างหลัง), and in front of (ข้างหน้า). Try looking at objects around your classroom or at home today, and practise describing where each one is in English. This is a skill we use every single day — whether we are giving a friend directions, explaining where a lost item might be, or writing an English report in the future.

สถานการณ์ปัจจุบัน: ฝุ่น PM2.5 ในประเทศไทย — ช่วงต้นปี 2568 ประเทศไทยเผชิญปัญหาฝุ่น PM2.5 หนักในหลายจังหวัด ตัวอย่างนี้ใช้โครงสร้าง Prepositions of Place เพื่อเชื่อมเนื้อหาเข้ากับสถานการณ์จริงในชีวิตของนักเรียน

Where is the Dust?
This is Nong Malee's house in Chiang Mai.
The air outside the house is not clean. There is a lot of PM2.5 dust in the air.
Nong Malee puts a mask on her face before she goes outside.
She puts her shoes next to the door.
Her air purifier is in front of her bed.
A small plant is on the table next to the window.
Nong Malee closes the window. The window is behind the curtain now.
She stays inside her house to be safe.

คำศัพท์ที่ควรรู้: mask = หน้ากาก | air purifier = เครื่องฟอกอากาศ | curtain = ม่าน | outside = ข้างนอก | safe = ปลอดภัย

Grammar Highlight — Prepositions of Place ที่ปรากฏในตัวอย่าง:

in ใน
in Chiang Mai / in the air / in her house

on บน
on her face / on the table

next to ข้างๆ
next to the door / next to the window

in front of ข้างหน้า
in front of her bed

behind ข้างหลัง
behind the curtain`;

const englishSongLyrics = `[Intro]
Where is it? Where can it be?
Let me use a preposition, follow me!

[Verse 1]
The book is on the table,
The cat is under the chair,
The bag is next to the door,
Prepositions everywhere!

[Chorus]
On, in, under, next to,
Behind and in front of too!
Tell me where the things are,
I can do it, yes I do!

[Verse 2]
The pencil is in the drawer,
The shoes are under the bed,
The TV is in front of the sofa,
Now I know what to say!

[Chorus]
On, in, under, next to,
Behind and in front of too!
Tell me where the things are,
I can do it, yes I do!

[Outro]
On, in, under, next to,
Behind and in front of too!
Now I know my prepositions,
And so do you!`;

const electricalContent2 = `แบบที่ 2 — เล่าเรื่อง
เริ่มจากเรื่องที่ใกล้ตัวที่สุด: ปลั๊กไฟในห้องเรียนนี้
ลองมองรอบ ๆ ห้องเรียนนี้สักครู่ ไฟฟ้าที่ทำให้หลอดไฟส่องสว่าง ที่ทำให้พัดลมหมุน ที่ชาร์จโทรศัพท์ของทุกคน มันมาจากไหน และมันเป็น "ไฟฟ้า" แบบไหนกัน?
คำตอบคือ ไฟฟ้าทั้งหมดนั้นคือ ไฟฟ้ากระแสสลับ (Alternating Current หรือ AC) ซึ่งเป็นไฟฟ้าแบบพิเศษที่กระแสไม่ได้ไหลทางเดียวตลอด แต่วิ่งไปวิ่งมาสลับทิศทางอยู่ตลอดเวลา เร็วมากถึง 50 ครั้งต่อวินาที จนตาเรามองไม่เห็นการสลับนั้นเลย
ลองจินตนาการว่าถ้ากระแสไฟฟ้าเป็นเหมือนน้ำในท่อ ไฟฟ้ากระแสตรง (DC) คือน้ำที่ไหลไปทางเดียวตลอด แต่ไฟฟ้ากระแสสลับ (AC) คือน้ำที่ไหลไปข้างหน้า-ข้างหลังสลับกันซ้ำ ๆ เหมือนคลื่นในอ่างน้ำ แล้วทำไมถึงต้องทำแบบนั้น? ทำไมไม่ใช้ไฟกระแสตรงให้สะดวกกว่า? คำตอบอยู่ที่ความลับของการ "ผลิต" ไฟฟ้าจากโรงไฟฟ้านั่นเอง

เรื่องของลวด แม่เหล็ก และการหมุน
ย้อนกลับไปในปี ค.ศ. 1831 นักวิทยาศาสตร์ชาวอังกฤษชื่อ ไมเคิล ฟาราเดย์ (Michael Faraday) ค้นพบสิ่งมหัศจรรย์ข้อหนึ่ง นั่นคือ "ถ้าเอาลวดไปตัดสนามแม่เหล็ก หรือถ้าเปลี่ยนความแรงของสนามแม่เหล็กที่อยู่รอบ ๆ ลวด มันจะทำให้เกิดแรงดันไฟฟ้าขึ้นในลวดทันที" ราวกับว่าแม่เหล็กมีพลังวิเศษที่สามารถ "ผลัก" อิเล็กตรอนในลวดให้เคลื่อนที่ได้
หลักการนี้เรียกว่า กฎการเหนี่ยวนำแม่เหล็กไฟฟ้า (Electromagnetic Induction) และมันคือหัวใจของเครื่องกำเนิดไฟฟ้าทุกชนิดบนโลกนี้ ตั้งแต่เครื่องเล็กในรถยนต์ ไปจนถึงเครื่องยักษ์ในโรงไฟฟ้าขนาดมหึมา
ลองนึกภาพเครื่องปั่นไฟแบบง่าย ๆ มีขดลวดรูปสี่เหลี่ยมอยู่ระหว่างขั้วแม่เหล็กเหนือ-ใต้ ถ้าหมุนขดลวดนั้น บางช่วงลวดจะตัดสนามแม่เหล็กมาก บางช่วงตัดน้อย บางช่วงไม่ตัดเลย ผลที่ได้คือแรงดันไฟฟ้าที่เกิดขึ้นจะขึ้น-ลง-ขึ้น-ลง เป็นรูปคลื่นสวยงาม ซึ่งนั่นแหละคือ คลื่นไซน์ (Sine Wave) อันเป็นลายเซ็นของไฟฟ้ากระแสสลับ

คลื่นไซน์บอกอะไรเราบ้าง?
ถ้าเราเอาโวลต์มิเตอร์ต่อกับสายไฟแล้วบันทึกค่าทุก ๆ เสี้ยววินาที เราจะได้กราฟรูปคลื่นที่สวยงาม เส้นโค้งขึ้นจากศูนย์ ถึงจุดสูงสุด กลับลงมาที่ศูนย์ ดิ่งลงจุดต่ำสุด แล้วกลับขึ้นอีกครั้ง และวนซ้ำแบบนี้ไปเรื่อย ๆ
การที่กราฟขึ้นบนแสดงว่ากระแสไฟฟ้ากำลังไหลในทิศทางหนึ่ง พอกราฟลงล่างแสดงว่ากระแสไหลสลับทิศทาง ทุก ๆ รอบคลื่นที่สมบูรณ์หนึ่งรอบเรียกว่า หนึ่งไซเคิล (One Cycle) และในระบบไฟฟ้าไทยจะมีการสลับ 50 ไซเคิลต่อวินาที ซึ่งเรียกว่ามีความถี่ 50 เฮิรตซ์ (50 Hz)
ความถี่กับชีวิตประจำวัน: ถ้าสังเกตหลอดไฟฟลูออเรสเซนต์ในห้องที่ไม่มีบัลลาสต์อิเล็กทรอนิกส์ มันจะกะพริบ 100 ครั้งต่อวินาที (50 Hz × 2) ซึ่งเร็วเกินกว่าตาคนจะจับได้ แต่กล้องถ่ายวิดีโอความเร็วสูงสามารถจับภาพการกะพริบนี้ได้
ค่าที่เราใช้บอกความแรงของไฟฟ้ากระแสสลับในชีวิตประจำวันไม่ใช่ค่าสูงสุด แต่เป็น ค่า RMS (Root Mean Square) หรือค่ากำลังงานสมมูล นั่นคือค่าที่บอกว่าไฟฟ้ากระแสสลับนี้ให้พลังงานเท่ากับไฟฟ้ากระแสตรงที่กี่โวลต์ ไฟบ้าน 220 โวลต์ที่เราพูดถึง คือค่า RMS 220 โวลต์ แต่จริง ๆ แล้วความต่างศักย์ขณะนั้นอาจสูงถึงกว่า 311 โวลต์ในจุดสูงสุดของคลื่น

การเดินทางของไฟฟ้ากระแสสลับจากต้นกำเนิดสู่ผู้ใช้
ที่โรงไฟฟ้า ไม่ว่าจะเป็นโรงไฟฟ้าพลังน้ำอย่างเขื่อนภูมิพล หรือโรงไฟฟ้าพลังความร้อน ทุกแห่งล้วนใช้หลักการเดียวกัน คือ "สร้างแรงหมุน เพื่อหมุนขดลวดในสนามแม่เหล็ก เพื่อผลิตไฟฟ้ากระแสสลับ" เพียงแต่ต้นกำลังที่ใช้หมุนแตกต่างกันออกไป เขื่อนใช้น้ำตก โรงไฟฟ้าก๊าซใช้ไอน้ำร้อน โรงไฟฟ้านิวเคลียร์ใช้ความร้อนจากปฏิกิริยานิวเคลียร์ฟิชชัน
เหตุผลที่ต้องส่งไฟฟ้าเป็นกระแสสลับ ก็เพราะไฟฟ้ากระแสสลับสามารถใช้ หม้อแปลงไฟฟ้า (Transformer) แปลงแรงดันขึ้นได้ง่าย การส่งไฟฟ้าแรงดันสูงหลายแสนโวลต์ผ่านสายส่งระยะไกลหลายร้อยกิโลเมตรจะสูญเสียพลังงานน้อยกว่ามาก แล้วค่อยแปลงแรงดันลงอีกครั้งก่อนถึงบ้านเรือน ซึ่งหม้อแปลงทำงานได้กับไฟฟ้ากระแสสลับเท่านั้น
สถานการณ์จริง — ช่างไฟฟ้าในโรงงาน: เมื่อช่างไฟฟ้าใช้มัลติมิเตอร์วัดไฟฟ้าในโรงงาน แล้วอ่านค่าได้ 380 โวลต์ (ไฟฟ้าสามเฟส) นั่นคือค่า RMS ไม่ใช่ค่าสูงสุด ช่างไฟฟ้าที่ดีต้องเข้าใจความสัมพันธ์นี้เพื่อเลือกอุปกรณ์ไฟฟ้าที่มีพิกัดแรงดัน (Voltage Rating) เหมาะสม และป้องกันอันตรายจากไฟฟ้าดูดได้อย่างถูกต้อง
`;

const electricalContent = `แบบที่ 1 — เชิงวิชาการ
ความหมายและธรรมชาติของไฟฟ้ากระแสสลับ
ไฟฟ้ากระแสสลับ (Alternating Current หรือ AC) หมายถึงกระแสไฟฟ้าที่มีทิศทางและขนาดเปลี่ยนแปลงสลับกันไปเป็นคาบเวลาที่แน่นอน กล่าวคือ กระแสไฟฟ้าจะไหลในทิศทางหนึ่งก่อน แล้วจึงสลับทิศทางกลับ และวนซ้ำอย่างต่อเนื่องตลอดเวลา ซึ่งแตกต่างจากไฟฟ้ากระแสตรง (Direct Current หรือ DC) ที่มีทิศทางการไหลคงที่ในทิศทางเดียวเสมอ
ในทางปฏิบัติ ไฟฟ้ากระแสสลับที่ใช้งานในระบบจ่ายไฟฟ้าทั่วไปจะมีรูปแบบของสัญญาณเป็น คลื่นไซน์ (Sinusoidal Wave) อันเป็นผลมาจากกลไกการผลิตไฟฟ้าภายในเครื่องกำเนิดไฟฟ้ากระแสสลับ (AC Generator หรือ Alternator) ที่อาศัยหลักการแม่เหล็กไฟฟ้าเป็นพื้นฐาน
นิยาม: ไฟฟ้ากระแสสลับ คือกระแสไฟฟ้าที่ขนาดและทิศทางเปลี่ยนแปลงอย่างเป็นคาบตามฟังก์ชันไซน์ของเวลา ซึ่งผลิตได้จากเครื่องกำเนิดไฟฟ้ากระแสสลับโดยอาศัยหลักการของกฎการเหนี่ยวนำแม่เหล็กไฟฟ้าของฟาราเดย์ (Faraday's Law of Electromagnetic Induction)

กฎการเหนี่ยวนำแม่เหล็กไฟฟ้าของฟาราเดย์
รากฐานสำคัญที่สุดของการเกิดไฟฟ้ากระแสสลับคือ กฎการเหนี่ยวนำแม่เหล็กไฟฟ้าของฟาราเดย์ (Faraday's Law of Electromagnetic Induction) ซึ่งกล่าวว่า เมื่อฟลักซ์แม่เหล็ก (Magnetic Flux, Φ) ที่พาดผ่านขดลวดเกิดการเปลี่ยนแปลงตามเวลา จะเกิดแรงดันไฟฟ้าเหนี่ยวนำ (Induced EMF) ขึ้นในขดลวดนั้น
ขนาดของแรงดันที่เหนี่ยวนำได้จะแปรผันโดยตรงกับอัตราการเปลี่ยนแปลงของฟลักซ์แม่เหล็ก กล่าวคือ ยิ่งฟลักซ์เปลี่ยนแปลงเร็ว แรงดันที่ได้ยิ่งมีขนาดสูง โดยแสดงเป็นสมการได้ว่า
e = −N × (ΔΦ / Δt)
โดยที่ e คือแรงดันไฟฟ้าเหนี่ยวนำ (โวลต์), N คือจำนวนรอบของขดลวด, ΔΦ คือการเปลี่ยนแปลงของฟลักซ์แม่เหล็ก (เวเบอร์), และ Δt คือช่วงเวลาที่เปลี่ยนแปลง (วินาที) เครื่องหมายลบในสมการแสดงถึงกฎของเลนซ์ (Lenz's Law) ที่บอกว่าแรงดันเหนี่ยวนำจะต้านทานต่อสาเหตุที่ทำให้เกิดขึ้นเสมอ

เครื่องกำเนิดไฟฟ้ากระแสสลับ (AC Generator / Alternator)
เครื่องกำเนิดไฟฟ้ากระแสสลับประกอบด้วยส่วนประกอบสำคัญ 2 ส่วนหลัก ได้แก่ ส่วนที่หมุน (Rotor) และส่วนที่อยู่นิ่ง (Stator) โดย อาร์มาเจอร์ (Armature) คือขดลวดที่จะถูกเหนี่ยวนำให้เกิดแรงดันไฟฟ้า และ สนามแม่เหล็ก (Field) ทำหน้าที่สร้างฟลักซ์แม่เหล็กที่จำเป็นในกระบวนการเหนี่ยวนำ
หลักการทำงานเป็นลำดับขั้นมีดังนี้
ขั้นที่ 1 ขดลวดสี่เหลี่ยม (Rectangular Coil) ถูกวางอยู่ในสนามแม่เหล็กสม่ำเสมอ (Uniform Magnetic Field) ที่เกิดจากแม่เหล็กถาวรหรือแม่เหล็กไฟฟ้า
ขั้นที่ 2 เมื่อขดลวดได้รับแรงหมุน (Torque) จากภายนอก เช่น จากกังหันน้ำ กังหันไอน้ำ หรือเครื่องยนต์ต้นกำลัง ขดลวดจะเริ่มหมุนด้วยความเร็วเชิงมุมคงที่ (Constant Angular Velocity, ω)
ขั้นที่ 3 ขณะที่ขดลวดหมุน มุมที่ขดลวดทำกับสนามแม่เหล็กจะเปลี่ยนแปลงอย่างต่อเนื่อง ส่งผลให้ฟลักซ์แม่เหล็กที่พาดผ่านขดลวดเปลี่ยนแปลงตามฟังก์ชันโคไซน์ของมุม นั่นคือ Φ = BAN·cosθ
ขั้นที่ 4 การเปลี่ยนแปลงของฟลักซ์ดังกล่าวทำให้เกิดแรงดันไฟฟ้าเหนี่ยวนำที่มีค่าแปรผันตามฟังก์ชันไซน์ของเวลา นั่นคือ e = E_max · sin(ωt) ซึ่งเป็นที่มาของคำว่า "ไฟฟ้ากระแสสลับแบบไซน์"

ค่าต่าง ๆ ของไฟฟ้ากระแสสลับที่ต้องรู้
ไฟฟ้ากระแสสลับมีปริมาณสำคัญที่ต้องทำความเข้าใจ ได้แก่
ค่าสูงสุด (Peak Value, E_max) คือแรงดันสูงสุด ณ จุดยอดของคลื่นไซน์
ค่า RMS (Root Mean Square, E_rms) คือค่ากำลังงานสมมูล คำนวณจาก E_rms = E_max / √2 ≈ 0.707 × E_max
ความถี่ (Frequency, f) คือจำนวนรอบต่อวินาที มีหน่วยเป็นเฮิรตซ์ (Hz)
คาบเวลา (Period, T) คือเวลาที่ใช้ครบหนึ่งรอบ คำนวณจาก T = 1/f
ความถี่เชิงมุม (Angular Frequency, ω) คำนวณจาก ω = 2πf มีหน่วยเป็น rad/s
ค่า RMS มีความสำคัญอย่างยิ่งในทางปฏิบัติ เพราะเป็นค่าที่วัดได้จากมัลติมิเตอร์และระบุบนอุปกรณ์ไฟฟ้าทั่วไป ไฟบ้าน 220 โวลต์ หมายถึงค่า RMS 220 โวลต์ ซึ่งมีค่าสูงสุดที่จุดยอดคลื่นอยู่ที่ประมาณ 311 โวลต์
ในประเทศไทย ระบบไฟฟ้าสาธารณูปโภคมีความถี่มาตรฐานที่ 50 เฮิรตซ์ หมายความว่าในหนึ่งวินาที กระแสไฟฟ้าจะสลับทิศทางครบ 50 รอบ หรือเปลี่ยนทิศทาง 100 ครั้งต่อวินาที โดยมีคาบเวลา T = 1/50 = 0.02 วินาทีต่อรอบ
การประยุกต์ใช้ในชีวิตประจำวัน
สถานการณ์ที่ 1 — ปลั๊กไฟในบ้าน: ไฟฟ้าที่ใช้ในบ้านทุกหลังคือไฟฟ้ากระแสสลับ 220 โวลต์ 50 เฮิรตซ์ ที่ผลิตจากโรงไฟฟ้าซึ่งใช้เครื่องกำเนิดไฟฟ้า (Alternator) ขนาดมหึมา ขดลวดภายในหมุนด้วยแรงของไอน้ำหรือน้ำตก สร้างไฟฟ้ากระแสสลับแล้วส่งมาตามสายไฟฟ้าแรงสูงหลายร้อยกิโลเมตร ก่อนแปลงแรงดันลดลงผ่านหม้อแปลง (Transformer) มาถึงบ้านของเรา
สถานการณ์ที่ 2 — ไดชาร์จรถยนต์: รถยนต์ทุกคันมีไดชาร์จ (Alternator) ซึ่งเป็นเครื่องกำเนิดไฟฟ้ากระแสสลับขนาดเล็กที่ถูกขับเคลื่อนด้วยสายพานจากเครื่องยนต์ ไฟฟ้ากระแสสลับที่ผลิตได้จะถูกแปลงเป็นไฟฟ้ากระแสตรงผ่านวงจรเรียงกระแส (Rectifier) เพื่อชาร์จแบตเตอรี่และจ่ายไฟให้อุปกรณ์ไฟฟ้าในรถ
นอกจากนี้ มอเตอร์ไฟฟ้ากระแสสลับ (AC Motor) ยังถูกใช้งานอย่างแพร่หลายในพัดลม เครื่องปรับอากาศ ตู้เย็น เครื่องซักผ้า และเครื่องจักรกลในโรงงานอุตสาหกรรม เนื่องจากมีโครงสร้างที่แข็งแรง บำรุงรักษาง่าย และมีประสิทธิภาพสูง

ไฟฟ้ากระแสสลับ (Alternating Current หรือ AC) เป็นกระแสไฟฟ้าที่มีทิศทางเปลี่ยนแปลงไปเรื่อยๆ ตรงข้ามกับกระแสตรง (DC) ที่มีทิศทางคงที่

ที่มาของไฟฟ้ากระแสสลับ

ไฟฟ้ากระแสสลับถูกสร้างขึ้นจากเครื่องกำเนิดไฟฟ้า (Generator) เมื่อขดลวดหมุนในสนามแม่เหล็ก แรงแม่เหล็กจะผลักดันอิเล็กตรอนให้เคลื่อนไหวในทิศทางหนึ่ง จากนั้นเมื่อขดลวดหมุนครึ่งรอบ แรงแม่เหล็กจะผลักดันอิเล็กตรอนในทิศทางตรงข้าม จึงทำให้กระแสไฟฟ้ามีทิศทางสลับไป-มา

ลักษณะสำคัญของไฟฟ้ากระแสสลับ

1. ทิศทางกระแสเปลี่ยนแปลงไปเรื่อยๆ - เช่น ในประเทศไทยกระแสสลับเปลี่ยนทิศ 50 ครั้งต่อวินาที (50 Hz)
2. แรงดันไฟฟ้า (Voltage) ก็เปลี่ยนแปลงไปตามลักษณะของกระแส
3. สามารถส่งกำลังไฟฟ้าได้ไกลมากกว่ากระแสตรง เพราะสามารถใช้หม้อแปลงไฟฟ้าปรับแรงดันได้
4. ขนาดของกระแสสลับวัดจากค่า RMS (Root Mean Square) ไม่ใช่ค่าสูงสุด

เหตุที่ใช้ไฟฟ้ากระแสสลับ

- ง่ายต่อการสร้างผ่านเครื่องกำเนิดไฟฟ้า
- สามารถปรับแรงดันได้ง่าย
- มีประสิทธิภาพสูงในการส่งกำลังไฟฟ้าไประยะไกล
- ส่วนใหญ่เครื่องใช้ในบ้านต้องใช้ไฟฟ้ากระแสสลับ

ความแตกต่างระหว่างไฟฟ้ากระแสตรงและกระแสสลับ

กระแสตรง (DC): ทิศทางคงที่ เหมาะสำหรับเครื่องใช้ขนาดเล็ก เช่น นาฬิกา ไฟฉาย มือถือ
กระแสสลับ (AC): ทิศทางเปลี่ยนแปลง เหมาะสำหรับใช้ในบ้านและอุตสาหกรรม

การประยุกต์ใช้ในชีวิตประจำวัน

ไฟฟ้าที่มาจากเต้าเสียบในบ้านเรา ทีวี พัดลม เครื่องซักผ้า อบแห้งผ้า และอื่นๆ ล้วนใช้ไฟฟ้ากระแสสลับ ความรู้เรื่องไฟฟ้ากระแสสลับจึงเป็นประโยชน์มากในการทำงานด้านช่างไฟฟ้า`;

const electronicsContent = `บทนำ
อุปกรณ์อิเล็กทรอนิกส์ที่ใช้งานในชีวิตประจำวัน ไม่ว่าจะเป็นไดโอด (Diode) ทรานซิสเตอร์ (Transistor) หรือวงจรรวม (Integrated Circuit: IC) ล้วนทำงานบนพื้นฐาน ของสมบัติทางไฟฟ้าของสาร เพื่อให้เข้าใจหลักการทำงานของอุปกรณ์เหล่านี้ได้อย่างถูกต้อง จึงจำเป็นต้องเริ่มจากการทำความเข้าใจโครงสร้างพื้นฐานที่สุดของสสาร นั่นคือ โครงสร้างอะตอม (Atomic Structure) และโครงสร้างของสารกึ่งตัวนำ (Semiconductor Structure)

1. โครงสร้างอะตอม (Atomic Structure)
1.1 แบบจำลองอะตอมของโบร์ (Bohr's Atomic Model)
ในวิชาอิเล็กทรอนิกส์ นิยมใช้แบบจำลองอะตอมของโบร์ (Bohr's Atomic Model) ซึ่งเสนอโดยนีลส์ โบร์ (Niels Bohr) นักฟิสิกส์ชาวเดนมาร์ก เมื่อปี ค.ศ. 1913 เป็นแบบจำลองที่เหมาะสมกับการอธิบายสมบัติทางไฟฟ้าของธาตุ

แบบจำลองนี้อธิบายว่า อะตอม (Atom) ประกอบด้วย 2 ส่วนหลัก คือ
ก. นิวเคลียส (Nucleus)
นิวเคลียสตั้งอยู่ที่ใจกลางของอะตอม ประกอบด้วยอนุภาค 2 ชนิด ได้แก่
โปรตอน (Proton) มีประจุไฟฟ้าเป็นบวก (+1) มีมวลประมาณ 1 หน่วยมวลอะตอม (Atomic Mass Unit: amu)
นิวตรอน (Neutron) ไม่มีประจุไฟฟ้า (เป็นกลาง) มีมวลใกล้เคียงกับโปรตอน

ข. อิเล็กตรอน (Electron)
อิเล็กตรอนมีประจุไฟฟ้าเป็นลบ (-1) มีมวลน้อยมากจนแทบละเลยได้เมื่อเทียบกับโปรตอนและนิวตรอน อิเล็กตรอนเคลื่อนที่อยู่รอบนิวเคลียสในระดับพลังงาน (Energy Level) หรือเรียกว่า ชั้นวงโคจร (Shell) ซึ่งแบ่งออกเป็นชั้น K, L, M, N, O, P, Q โดยนับจากชั้นในสุดออกไปยังชั้นนอกสุด ตามลำดับ ในสภาวะปกติ อะตอมจะมีจำนวนโปรตอนเท่ากับจำนวนอิเล็กตรอนเสมอ ส่งผลให้อะตอมมีสภาพเป็นกลางทางไฟฟ้า (Electrically Neutral)

1.2 เลขอะตอม (Atomic Number)
เลขอะตอม (Atomic Number) คือ จำนวนโปรตอนทั้งหมดในนิวเคลียสของอะตอม ซึ่งเป็นตัวระบุชนิดของธาตุ (Element) อย่างเฉพาะเจาะจง ตัวอย่างเช่น ธาตุซิลิกอน (Silicon, Si) มีเลขอะตอมเท่ากับ 14 หมายความว่ามีโปรตอน 14 ตัวในนิวเคลียส และในสภาวะปกติจะมีอิเล็กตรอน 14 ตัวเช่นกัน

1.3 การจัดเรียงอิเล็กตรอน (Electron Configuration)
อิเล็กตรอนจะจัดเรียงตัวในชั้นวงโคจรตามกฎ 2n² โดยที่ n แทนหมายเลขชั้นวงโคจร ดังแสดงในตารางต่อไปนี้

ชั้นวงโคจร | คำ ก | จำนวนอิเล็กตรอนสูงสุด (2n²)
K | 1 | 2
L | 2 | 8
M | 3 | 18
N | 4 | 32

อิเล็กตรอนในชั้นวงโคจรที่อยู่ใกล้นิวเคลียสมากที่สุดจะมีระดับพลังงานต่ำกว่า และถูกยึดไว้แน่นกว่าอิเล็กตรอนในชั้นนอก

1.4 วาเลนซ์อิเล็กตรอน (Valence Electron)
อิเล็กตรอนที่อยู่ในชั้นวงโคจรนอกสุดของอะตอม เรียกว่า วาเลนซ์อิเล็กตรอน (Valence Electron) ซึ่งมีบทบาทสำคัญอย่างยิ่งในการกำหนดสมบัติทางไฟฟ้าของสาร โดยแบ่งได้ดังนี้

ตัวนำไฟฟ้า (Conductor): สารที่มีวาเลนซ์อิเล็กตรอน 1–3 ตัว อิเล็กตรอนหลุดออกได้ง่าย นำไฟฟ้าได้ดี เช่น ทองแดง (Cu) เงิน (Ag) อลูมิเนียม (Al)

ฉนวนไฟฟ้า (Insulator): สารที่มีวาเลนซ์อิเล็กตรอนครบ 8 ตัว อิเล็กตรอนถูกยึดไว้แน่น ไม่นำไฟฟ้า เช่น แก้ว ยาง พลาสติก

สารกึ่งตัวนำ (Semiconductor): สารที่มีวาเลนซ์อิเล็กตรอน 4 ตัว มีสมบัติการนำไฟฟ้าอยู่ระหว่างตัวนำและฉนวน เช่น ซิลิกอน (Si) เจอร์เมเนียม (Ge)

2. สารกึ่งตัวนำ (Semiconductor)
2.1 ความหมายและความสำคัญ
สารกึ่งตัวนำ (Semiconductor) คือ สารที่มีสมบัติทางไฟฟ้าอยู่ระหว่างตัวนำไฟฟ้าและฉนวนไฟฟ้า กล่าวคือ ในสภาวะปกติ (อุณหภูมิห้อง) นำกระแสไฟฟ้าได้น้อย แต่เมื่อได้รับพลังงานจากภายนอก เช่น ความร้อน (Heat) แสงสว่าง (Light) หรือสนามไฟฟ้า (Electric Field) ความสามารถในการนำไฟฟ้าจะเพิ่มขึ้นอย่างมีนัยสำคัญ คุณสมบัตินี้เองทำให้สารกึ่งตัวนำ เป็นพื้นฐานสำคัญของอุปกรณ์อิเล็กทรอนิกส์ทุกชนิด

2.2 ซิลิกอน (Silicon, Si)
ซิลิกอนเป็นสารกึ่งตัวนำที่ใช้มากที่สุดในอุตสาหกรรมอิเล็กทรอนิกส์ พบมากในรูปของสารประกอบซิลิกาในทราย มีคุณสมบัติดังนี้

เลขอะตอม: 14
การจัดเรียงอิเล็กตรอน: 2 – 8 – 4
ชั้น K: 2 อิเล็กตรอน
ชั้น L: 8 อิเล็กตรอน
ชั้น M (ชั้นนอกสุด): 4 อิเล็กตรอน  →  วาเลนซ์อิเล็กตรอน = 4 ตัว

2.3 เจอร์เมเนียม (Germanium, Ge)
เจอร์เมเนียมเป็นสารกึ่งตัวนำที่ถูกนำมาใช้ก่อนซิลิกอนในยุคเริ่มต้นของอิเล็กทรอนิกส์ มีคุณสมบัติดังนี้

เลขอะตอม: 32
การจัดเรียงอิเล็กตรอน: 2 – 8 – 18 – 4
ชั้น K: 2 อิเล็กตรอน
ชั้น L: 8 อิเล็กตรอน
ชั้น M: 18 อิเล็กตรอน
ชั้น N (ชั้นนอกสุด): 4 อิเล็กตรอน  →  วาเลนซ์อิเล็กตรอน = 4 ตัว

เจอร์เมเนียมมีขนาดอะตอมใหญ่กว่าซิลิกอน ส่งผลให้พลังงานที่ใช้ในการทำให้อิเล็กตรอน หลุดออกจากพันธะน้อยกว่า อิเล็กตรอนจึงเคลื่อนที่ได้ง่ายกว่าแม้ที่อุณหภูมิต่ำ อย่างไรก็ตาม ซิลิกอนได้รับความนิยมมากกว่าเพราะมีปริมาณมากในธรรมชาติ ราคาถูกกว่า และทนต่ออุณหภูมิสูงได้ดีกว่า

2.4 พันธะโควาเลนต์ (Covalent Bond) และโครงสร้างผลึก (Crystal Structure)
ในสารกึ่งตัวนำบริสุทธิ์ (Intrinsic Semiconductor) อะตอมแต่ละตัวจะสร้างพันธะกับ อะตอมข้างเคียง 4 อะตอม โดยใช้วิธีการใช้อิเล็กตรอนร่วมกัน (Electron Sharing) เรียกว่า พันธะโควาเลนต์ (Covalent Bond)

กลไกของพันธะโควาเลนต์ คือ อะตอม 2 ตัวที่อยู่ติดกันจะแบ่งปันวาเลนซ์อิเล็กตรอน ร่วมกัน ข้างละ 1 ตัว รวมเป็นอิเล็กตรอนที่ใช้ร่วมกัน 2 ตัว (1 คู่) ทำให้อะตอมแต่ละตัว มีอิเล็กตรอนในชั้นนอกสุดครบ 8 ตัว ซึ่งเป็นสภาวะที่เสถียรที่สุดตามกฎออกเตต (Octet Rule)

เมื่ออะตอมของซิลิกอนสร้างพันธะโควาเลนต์กับอะตอมข้างเคียงทุกทิศทางอย่างสม่ำเสมอ จะได้โครงสร้างที่เรียกว่า โครงสร้างผลึก (Crystal Structure) ซึ่งมีระเบียบแบบแผนสม่ำเสมอในสามมิติ โครงสร้างผลึกนี้ทำให้ซิลิกอนบริสุทธิ์ มีความแข็งแกร่งทางกลและมีสมบัติทางไฟฟ้าที่สม่ำเสมอ

2.5 อิเล็กตรอนอิสระและโฮล (Free Electron and Hole)
ที่อุณหภูมิต่ำมาก (ใกล้ 0 เคลวิน) อิเล็กตรอนทุกตัวถูกยึดอยู่กับพันธะโควาเลนต์ อย่างแน่นหนา สารกึ่งตัวนำจึงไม่นำกระแสไฟฟ้า แต่เมื่ออุณหภูมิสูงขึ้น พลังงานความร้อน จะถ่ายทอดให้แก่อิเล็กตรอน ทำให้อิเล็กตรอนบางตัวมีพลังงานสูงพอที่จะหลุดออกจาก พันธะโควาเลนต์ กลายเป็นอิเล็กตรอนอิสระ

เมื่ออิเล็กตรอนหลุดออกจากพันธะ จะทิ้งช่องว่างที่มีประจุบวกสุทธิไว้ เรียกว่า โฮล (Hole) โฮลสามารถเคลื่อนที่ได้เสมือนอนุภาคที่มีประจุบวก โดยอิเล็กตรอนจากพันธะข้างเคียง จะเคลื่อนเข้ามาเติมที่โฮล และทำให้เกิดโฮลใหม่ที่ตำแหน่งเดิมของอิเล็กตรอนนั้น

ดังนั้น กระแสไฟฟ้าในสารกึ่งตัวนำเกิดจาก พาหะนำกระแส (Current Carrier) 2 ชนิด คือ
อิเล็กตรอนอิสระ (Free Electron): เคลื่อนที่จากขั้วลบไปยังขั้วบวก
โฮล (Hole): เคลื่อนที่จากขั้วบวกไปยังขั้วลบ (ทิศทางตรงข้ามกับอิเล็กตรอน)

3. ตัวอย่างการนำไปใช้ในชีวิตประจำวัน (Real-Life Application)
ความเข้าใจเรื่องโครงสร้างอะตอมและสารกึ่งตัวนำเป็นรากฐานสำคัญในการทำความเข้าใจ อุปกรณ์ที่อยู่รอบตัวนักเรียน ดังตัวอย่างต่อไปนี้

โซลาร์เซลล์ (Solar Cell): ทำจากซิลิกอนที่ผ่านกระบวนการเติมสารเจือปน เมื่อแสงอาทิตย์ตกกระทบแผงโซลาร์เซลล์ พลังงานแสงจะทำให้อิเล็กตรอนหลุดออกจากพันธะโควาเลนต์ กลายเป็นกระแสไฟฟ้า ซึ่งเป็นหลักการเดียวกับที่นักเรียนได้เรียนในหัวข้อนี้

สมาร์ทโฟนและคอมพิวเตอร์: ชิปประมวลผล (Processor Chip) ที่เป็นสมองกลของสมาร์ทโฟนและคอมพิวเตอร์ทุกเครื่อง ทำจากซิลิกอนที่ผ่านกระบวนการผลิตที่ซับซ้อน โดยภายในชิปขนาดเล็กเพียงปลายนิ้ว อาจมีทรานซิสเตอร์มากกว่าหลายพันล้านตัว ซึ่งแต่ละตัวทำงานบนพื้นฐานของสมบัติ สารกึ่งตัวนำ

ไดโอดเปล่งแสง (Light Emitting Diode: LED): หลอด LED ที่ใช้แทนหลอดไฟดั้งเดิมในปัจจุบันทำงานโดยอาศัยหลักการที่อิเล็กตรอน เคลื่อนที่และรวมตัวกับโฮลในสารกึ่งตัวนำ ปลดปล่อยพลังงานออกมาในรูปของแสง

สรุป
โครงสร้างอะตอมตามแบบจำลองของโบร์ ประกอบด้วยนิวเคลียสที่มีโปรตอนและนิวตรอน และมีอิเล็กตรอนวิ่งวนในชั้นวงโคจรรอบนอก จำนวนวาเลนซ์อิเล็กตรอน (อิเล็กตรอนชั้นนอกสุด) เป็นตัวกำหนดสมบัติทางไฟฟ้าของสาร โดยสารกึ่งตัวนำอย่างซิลิกอนและเจอร์เมเนียม มีวาเลนซ์อิเล็กตรอน 4 ตัว สร้างโครงสร้างผลึกโดยพันธะโควาเลนต์กับอะตอมข้างเคียง และการนำกระแสไฟฟ้าในสารกึ่งตัวนำเกิดจากพาหะ 2 ชนิด คือ อิเล็กตรอนอิสระและโฮล ซึ่งเป็นพื้นฐานของการทำงานของอุปกรณ์อิเล็กทรอนิกส์ทุกชนิด`;

const electronicsContent2 = `แบบที่ 2 — เล่าเรื่อง
เริ่มต้นที่สิ่งเล็กที่สุด
ลองนึกภาพว่าสมาร์ทโฟนในมือของนักเรียนตอนนี้ ภายในเครื่องมีชิปประมวลผลขนาดเล็ก กว่าเล็บนิ้วก้อย แต่ภายในชิปนั้นบรรจุทรานซิสเตอร์ไว้มากกว่าหลายพันล้านตัว และทรานซิสเตอร์ทุกตัวทำจากสารชนิดเดียวกัน นั่นก็คือ ซิลิกอน (Silicon) หรือก็คือทรายธรรมดา ๆ ที่ผ่านกระบวนการผลิตระดับสูง
เพื่อให้เข้าใจว่าทำไมทรายธรรมดา ๆ ถึงกลายมาเป็นหัวใจของเทคโนโลยีสมัยใหม่ได้ เราต้องย้อนกลับไปดูที่จุดเริ่มต้นที่เล็กที่สุด นั่นก็คือ อะตอม (Atom)

อะตอมคืออะไร และมันหน้าตาเป็นอย่างไร?
ทุกสิ่งทุกอย่างในโลกนี้ ตั้งแต่น้ำ อากาศ กระดาษ เหล็ก ไปจนถึงตัวนักเรียนเอง ล้วนประกอบขึ้นจากอะตอม (Atom) อะตอมเป็นหน่วยที่เล็กมากจนมองไม่เห็นด้วยตาเปล่า แต่นักวิทยาศาสตร์ได้สร้างแบบจำลองขึ้นมาเพื่อช่วยให้เราจินตนาการถึงโครงสร้างของมันได้
แบบจำลองที่นิยมใช้ในวิชาอิเล็กทรอนิกส์ คือ แบบจำลองอะตอมของโบร์ (Bohr's Atomic Model) ซึ่งเปรียบอะตอมได้กับ "ระบบสุริยะจำลอง" นั่นเอง
ตรงกลางสุดคือ นิวเคลียส (Nucleus) เปรียบเหมือนดวงอาทิตย์ที่อยู่ใจกลาง ภายในนิวเคลียสมีอนุภาค 2 ชนิดอยู่รวมกัน คือ โปรตอน (Proton) ซึ่งมีประจุบวก และ นิวตรอน (Neutron) ซึ่งไม่มีประจุ
วิ่งวนอยู่รอบนิวเคลียสคือ อิเล็กตรอน (Electron) เปรียบเหมือนดาวเคราะห์ที่โคจรรอบดวงอาทิตย์ อิเล็กตรอนมีประจุลบ และไม่ได้วิ่งวุ่นอยู่อย่างไร้ระเบียบ แต่วิ่งอยู่ในเส้นทางที่กำหนดไว้ เรียกว่า ชั้นวงโคจร (Shell) โดยชั้นแรกที่อยู่ใกล้นิวเคลียสที่สุดเรียกว่าชั้น K ถัดออกมาคือชั้น L, M, N ตามลำดับ
ในสภาวะปกติ อะตอมจะมีจำนวนโปรตอนเท่ากับจำนวนอิเล็กตรอนพอดี ทำให้ประจุบวกและลบ หักล้างกัน อะตอมจึงมีสภาพเป็นกลางทางไฟฟ้า เปรียบได้กับคนที่มีรายรับเท่ากับรายจ่ายพอดี ไม่มีหนี้สิน

ชั้นในสุด ชั้นนอกสุด และ "อิเล็กตรอนตัวสำคัญ"
แต่ละชั้นวงโคจรรับอิเล็กตรอนได้ไม่เท่ากัน ชั้น K รับได้สูงสุด 2 ตัว ชั้น L รับได้ สูงสุด 8 ตัว และชั้น M รับได้สูงสุด 18 ตัว อิเล็กตรอนจะเรียงตัวจากชั้นในออกมาชั้นนอก
สิ่งที่สำคัญที่สุดในวิชาอิเล็กทรอนิกส์คืออิเล็กตรอนในชั้นนอกสุด เรียกว่า วาเลนซ์อิเล็กตรอน (Valence Electron) เพราะอิเล็กตรอนกลุ่มนี้อยู่ห่างจากนิวเคลียสมากที่สุด แรงดึงดูดที่นิวเคลียส มีต่อมันจึงน้อยที่สุด และเป็นตัวที่มีโอกาสหลุดออกมาเคลื่อนที่ได้มากที่สุด
ลองนึกภาพง่าย ๆ ว่านิวเคลียสเปรียบเหมือนนายจ้าง ส่วนอิเล็กตรอนแต่ละชั้นเปรียบเหมือน พนักงาน อิเล็กตรอนชั้นในสุดอยู่ใกล้นายจ้าง ถูกควบคุมอย่างเข้มงวด ส่วนอิเล็กตรอน ชั้นนอกสุดอยู่ไกลออกไป ควบคุมได้น้อยกว่า และออกไปเที่ยวได้ง่ายกว่า
จำนวนวาเลนซ์อิเล็กตรอนนี่เองที่บอกว่าสารนั้น ๆ นำไฟฟ้าได้ดีแค่ไหน สารที่มีวาเลนซ์อิเล็กตรอนน้อย เช่น 1–2 ตัว อย่างทองแดงหรือเหล็ก อิเล็กตรอนหลุดออกมาวิ่งได้ง่าย จึงนำไฟฟ้าได้ดี ส่วนสารที่มีวาเลนซ์อิเล็กตรอนครบ 8 ตัว อย่างยางหรือพลาสติก อิเล็กตรอนถูกยึดไว้แน่นมาก จึงไม่นำไฟฟ้า และมีสารกลุ่มพิเศษ ที่มีวาเลนซ์อิเล็กตรอนพอดี 4 ตัว ซึ่งเป็นตัวเลขที่น่าสนใจมาก นั่นคือ สารกึ่งตัวนำ

รู้จักกับ "ซิลิกอน" พระเอกของวงการอิเล็กทรอนิกส์
ซิลิกอน (Silicon, Si) มีเลขอะตอม 14 หมายความว่ามีโปรตอน 14 ตัวในนิวเคลียส และมีอิเล็กตรอน 14 ตัวเรียงอยู่ในวงโคจรแบบนี้ คือ ชั้น K มี 2 ตัว  ชั้น L มี 8 ตัว  ชั้นนอกสุด (M) มี 4 ตัว รวมได้ครบ 14 ตัวพอดี
ชั้นนอกสุดของซิลิกอนมีอิเล็กตรอน 4 ตัว แต่ชั้นนั้นรับได้สูงสุด 8 ตัว จึงยังขาดอีก 4 ตัว นี่แหละคือจุดสำคัญ เพราะซิลิกอนแต่ละอะตอมจะพยายาม "หา" อิเล็กตรอนมาเติมให้ครบ 8 ตัว

เพื่อนบ้านที่ดี: พันธะโควาเลนต์
วิธีที่ซิลิกอนแก้ปัญหา "อิเล็กตรอนไม่ครบ" นี้ไม่ใช่การแย่งอิเล็กตรอนจากอะตอมอื่น แต่ใช้การ "แบ่งปัน" อิเล็กตรอนร่วมกันกับอะตอมข้างเคียง 4 อะตอม โดยแต่ละคู่จะแบ่งปันอิเล็กตรอนกันคู่ละ 2 ตัว วิธีการนี้เรียกว่า พันธะโควาเลนต์ (Covalent Bond)
เปรียบง่าย ๆ ได้ว่าเหมือนเพื่อนบ้านที่มีของไม่ครบแต่ช่วยกันแบ่งใช้ ทำให้ทุกคนรู้สึกว่า ตัวเองมีของครบ ซิลิกอน 1 อะตอมมีวาเลนซ์อิเล็กตรอน 4 ตัว เมื่อสร้างพันธะกับอะตอม ข้างเคียง 4 อะตอม แต่ละอะตอมก็จะมีอิเล็กตรอนในชั้นนอกสุดเป็น 8 ตัว (4 ตัวของตัวเอง + 4 ตัวที่ใช้ร่วมกับเพื่อน) ซึ่งเป็นสภาวะที่เสถียรและ "มีความสุข" ที่สุดของอะตอม
เมื่อซิลิกอนนับล้าน ๆ อะตอมสร้างพันธะโควาเลนต์ในทุกทิศทางอย่างเป็นระเบียบ จะได้ โครงสร้างที่เรียกว่า โครงสร้างผลึก (Crystal Structure) ซึ่งมีรูปแบบที่สม่ำเสมอสวยงาม นี่คือรูปแบบที่ซิลิกอนในแผงโซลาร์เซลล์ หรือชิปในสมาร์ทโฟนของนักเรียนมีอยู่

เจอร์เมเนียม: พี่ใหญ่ที่ถูกลืม
ก่อนที่ซิลิกอนจะมีชื่อเสียง เจอร์เมเนียม (Germanium, Ge) คือสารกึ่งตัวนำที่ถูกนำมาใช้ สร้างทรานซิสเตอร์ตัวแรกในปี ค.ศ. 1947 เจอร์เมเนียมมีเลขอะตอม 32 และมีวาเลนซ์อิเล็กตรอน 4 ตัวเช่นกัน ดังนั้นโครงสร้างและพันธะโควาเลนต์ จึงมีลักษณะเดียวกับซิลิกอน
แต่เจอร์เมเนียมมีอะตอมใหญ่กว่า พันธะที่ยึดอิเล็กตรอนจึงหลวมกว่า อิเล็กตรอนหลุดออกมาได้ ง่ายกว่าแม้ที่อุณหภูมิไม่สูงมาก ฟังดูเหมือนข้อดี แต่ข้อเสียคือมันหลุดออกมามากเกินไปเมื่อ อุณหภูมิสูงขึ้น ทำให้ควบคุมได้ยาก ซิลิกอนจึงชนะการแข่งขันในที่สุด เพราะทนร้อนได้ดีกว่า หาได้ง่ายกว่า และราคาถูกกว่ามาก

เมื่ออิเล็กตรอนหนีออกจากบ้าน
ในสภาวะปกติที่อุณหภูมิห้อง อิเล็กตรอนส่วนใหญ่ยังอยู่กับพันธะโควาเลนต์ แต่ความร้อนจากอุณหภูมิห้องก็มีพลังงานเพียงพอที่จะทำให้อิเล็กตรอนบางตัว "กระโดด" ออกจากพันธะ กลายเป็น อิเล็กตรอนอิสระ (Free Electron) ที่วิ่งเที่ยวได้อย่างเสรี
และเมื่ออิเล็กตรอน "หนีออกจากบ้าน" ตำแหน่งที่ว่างไปก็จะกลายเป็น ช่องว่างที่มีประจุบวกสุทธิ เรียกว่า โฮล (Hole) โฮลนี้ไม่ใช่อนุภาคจริง ๆ แต่เปรียบเหมือนที่นั่งว่างในโรงหนัง เมื่อมีที่นั่งว่าง คนในแถวข้าง ๆ ก็อาจเลื่อนมานั่งแทน ทำให้ที่นั่งว่างเดิม ย้ายไปอยู่ที่ใหม่ โฮลก็เคลื่อนที่ได้ในลักษณะเดียวกัน
ดังนั้น กระแสไฟฟ้าในซิลิกอนเกิดจาก 2 ตัวละคร คือ อิเล็กตรอนอิสระที่วิ่งสวนทางกับ กระแสไฟฟ้า และโฮลที่เคลื่อนที่ไปในทิศทางเดียวกับกระแสไฟฟ้า ทั้งสองทำงานร่วมกัน นำพากระแสไฟฟ้าผ่านอุปกรณ์อิเล็กทรอนิกส์ต่าง ๆ

มองรอบตัวแล้วจะเห็นซิลิกอนอยู่ทุกที่
เมื่อนักเรียนชาร์จโทรศัพท์อยู่ที่บ้านด้วยแผงโซลาร์เซลล์ซึ่งนิยมติดตั้งตามบ้านเรือน มากขึ้นในปัจจุบัน แสงแดดที่ตกกระทบแผงโซลาร์เซลล์กำลังทำให้อิเล็กตรอนในซิลิกอน หลุดออกจากพันธะโควาเลนต์ กลายเป็นกระแสไฟฟ้าที่วิ่งเข้ามาชาร์จแบตเตอรี่ นี่คือหลักการเดียวกับที่เรียนในวันนี้นั่นเอง
หลอดไฟ LED ที่ให้แสงสว่างทั่วห้องเรียน ก็เกิดจากการที่อิเล็กตรอนเคลื่อนที่กลับ เข้ามารวมกับโฮลในสารกึ่งตัวนำ และปล่อยพลังงานออกมาในรูปของแสง ส่วนสมาร์ทโฟน แล็ปท็อป หรือแม้แต่รถยนต์ไฟฟ้าที่เห็นบนท้องถนน ล้วนทำงานด้วยอุปกรณ์ที่สร้างบนพื้นฐานของซิลิกอนและความเข้าใจในโครงสร้างอะตอม
ความรู้ที่ดูเหมือนจะเล็กนิดเดียวเรื่องอะตอมนี้ จึงเป็นรากฐานสำคัญของเทคโนโลยีที่เปลี่ยนโลก

สรุปเรื่องที่เรียนวันนี้
อะตอมประกอบด้วยนิวเคลียสซึ่งมีโปรตอนและนิวตรอน และมีอิเล็กตรอนวิ่งรอบอยู่ใน ชั้นวงโคจร อิเล็กตรอนชั้นนอกสุดหรือวาเลนซ์อิเล็กตรอนเป็นตัวบ่งบอกสมบัติทางไฟฟ้า ของสาร สารกึ่งตัวนำอย่างซิลิกอนและเจอร์เมเนียมมีวาเลนซ์อิเล็กตรอน 4 ตัว สร้างพันธะโควาเลนต์กับอะตอมข้างเคียงจนกลายเป็นโครงสร้างผลึกที่เป็นระเบียบ เมื่อมีพลังงานมากระตุ้น อิเล็กตรอนจะหลุดออกมาเป็นอิเล็กตรอนอิสระ และทิ้งโฮลไว้ ทั้งสองชนิดทำหน้าที่เป็นพาหะนำกระแสไฟฟ้าในอุปกรณ์อิเล็กทรอนิกส์ทุกชิ้นที่เราใช้งาน`;

const qrPattern = [
  [true, true, true, true, true, true, true],
  [true, false, false, true, false, false, true],
  [true, false, true, true, true, false, true],
  [true, false, true, false, true, false, true],
  [true, false, true, true, true, false, true],
  [true, false, false, false, false, false, true],
  [true, true, true, true, true, true, true],
];

type TabOption = {
  value: string;
  label: string;
  icon: typeof Video;
};

const tabOptions: TabOption[] = [
  { value: "lesson-content", label: "เนื้อหาการเรียน", icon: FileText },
  { value: "lesson-plan", label: "แผนการจัดการเรียนรู้", icon: FileText },
  { value: "video", label: "วีดีโอ", icon: Video },
  { value: "slides-lesson", label: "สไลด์การสอน", icon: Presentation },
  { value: "slides-activity", label: "สไลด์กิจกรรม", icon: Presentation },
  { value: "quiz", label: "แบบฝึกหัด", icon: FileQuestion },
];

function MockQrCode() {
  return (
    <div className="grid aspect-square w-36 grid-cols-7 gap-1 rounded-2xl border bg-card p-3 shadow-inner">
      {qrPattern.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <span
            key={`${rowIndex}-${colIndex}`}
            className={`rounded-[3px] ${cell ? "bg-slate-950" : "bg-transparent"}`}
          />
        )),
      )}
    </div>
  );
}

function renderGenericTabContent(tabLabel: string, Icon: typeof Video) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/10 p-8 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{tabLabel}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">เนื้อหาจะปรากฏหลังจากการสร้างเสร็จสิ้น</p>
    </div>
  );
}

export default function GeneratedFilesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lesson-content");
  const draft = useMemo(() => getDraftFromStorage(), []);

  const isTimeLessonFeatured = useMemo(
    () =>
      draft.subject === timeLessonSelection.subject &&
      draft.unit === timeLessonSelection.unit &&
      draft.topic === timeLessonSelection.topic,
    [draft],
  );

  const isScienceLessonFeatured = useMemo(
    () =>
      draft.subject === scienceLessonSelection.subject &&
      draft.unit === scienceLessonSelection.unit &&
      draft.topic === scienceLessonSelection.topic,
    [draft],
  );

  const isEnglishLessonFeatured = useMemo(
    () =>
      draft.subject === englishLessonSelection.subject &&
      draft.unit === englishLessonSelection.unit &&
      draft.topic === englishLessonSelection.topic,
    [draft],
  );

  const isElectricalLessonFeatured = useMemo(
    () =>
      draft.major === electricalLessonSelection.major &&
      draft.subject === electricalLessonSelection.subject &&
      draft.unit === electricalLessonSelection.unit &&
      draft.topic === electricalLessonSelection.topic,
    [draft],
  );

  const isElectricalLessonFormat2 = useMemo(
    () =>
      isElectricalLessonFeatured &&
      (draft.lessonContent?.includes("แบบที่ 2 — เล่าเรื่อง") ?? false),
    [draft, isElectricalLessonFeatured],
  );

  const isElectronicsLessonFeatured = useMemo(
    () =>
      draft.major === electronicsLessonSelection.major &&
      draft.subject === electronicsLessonSelection.subject &&
      draft.unit === electronicsLessonSelection.unit &&
      draft.topic === electronicsLessonSelection.topic,
    [draft],
  );

  const isElectronicsLessonFormat2 = useMemo(
    () =>
      isElectronicsLessonFeatured &&
      (draft.lessonContent?.includes("แบบที่ 2 — เล่าเรื่อง") ?? false),
    [draft, isElectronicsLessonFeatured],
  );

  const shouldShowFeaturedMockup = isTimeLessonFeatured || isScienceLessonFeatured || isEnglishLessonFeatured || isElectricalLessonFeatured || isElectronicsLessonFeatured;

  // Remove leading number and dot from topic name (e.g., "1. โครงสร้างอะตอม" -> "โครงสร้างอะตอม")
  const cleanTopicName = (topic: string) => {
    return topic.replace(/^\d+\.\s*/, "");
  };

  const lessonTopic = draft.topic || timeLessonSelection.topic;
  const cleanedTopic = cleanTopicName(lessonTopic);
  const lessonPlanTitle = `แผนการสอนเรื่อง ${cleanedTopic}`;
  const quizTitle = `แบบฝึกหัดเรื่อง ${cleanedTopic}`;
  const gameTitle = `เกมเรื่อง ${cleanedTopic}`;

  const handleSave = () => {
    const lessonId = createLessonId();

    // Determine which featured content to use based on draft
    let contentToUse = draft.lessonContent || "";
    if (isElectronicsLessonFeatured) {
      contentToUse = electronicsContent;
    } else if (isElectricalLessonFormat2) {
      contentToUse = electricalContent2;
    } else if (isElectricalLessonFeatured) {
      contentToUse = electricalContent;
    } else if (isEnglishLessonFeatured) {
      contentToUse = englishContent;
    } else if (isScienceLessonFeatured) {
      contentToUse = scienceContent;
    } else if (isTimeLessonFeatured) {
      contentToUse = timeContent;
    }

    const lesson: SavedLesson = {
      id: lessonId,
      planName: draft.planName || "Untitled Lesson",
      major: draft.major || "",
      subject: draft.subject || "",
      unit: draft.unit || "",
      topic: draft.topic || "",
      createdAt: Date.now(),
      createdAtDisplay: formatDate(Date.now()),
      content: {
        video: "https://via.placeholder.com/640x360?text=Video",
        slidesLesson: "https://via.placeholder.com/640x360?text=Slides+Lesson",
        slidesActivity: "https://via.placeholder.com/640x360?text=Slides+Activity",
        lessonPlan: "https://via.placeholder.com/640x360?text=Lesson+Plan",
        quiz: "https://via.placeholder.com/640x360?text=Quiz",
        song: "https://via.placeholder.com/640x360?text=Song",
        game: "https://via.placeholder.com/640x360?text=Game",
        lessonContent: contentToUse,
      },
    };

    saveLessonToStorage(lesson);
    navigate("/dashboard/lesson-plan");
  };

  const renderTabContent = (tabValue: string) => {
    const contentToDisplay = isElectronicsLessonFormat2 ? electronicsContent2 : isElectronicsLessonFeatured ? electronicsContent : isElectricalLessonFormat2 ? electricalContent2 : isElectricalLessonFeatured ? electricalContent : isEnglishLessonFeatured ? englishContent : isScienceLessonFeatured ? scienceContent : timeContent;
    const contentUrl = isElectronicsLessonFormat2 ? electronicsContent2Url : isElectronicsLessonFeatured ? electronicsContentUrl : isElectricalLessonFormat2 ? electricalContent2Url : isElectricalLessonFeatured ? electricalContentUrl : isEnglishLessonFeatured ? englishContentUrl : isScienceLessonFeatured ? scienceContentUrl : timeContentUrl;
    const contentFileName = isElectronicsLessonFeatured ? "เนื้อหา_โครงสร้างอะตอม.docx" : isElectricalLessonFeatured ? "เนื้อหา_ไฟฟ้ากระแสสลับ.docx" : isEnglishLessonFeatured ? "เนื้อหา_Eng P.4_In my house_v2.docx" : isScienceLessonFeatured ? "เนื้อหา_Sci P.1_ร่างกาย.docx" : "เนื้อหา_เวลา.docx";
    const planUrl = isElectronicsLessonFeatured ? electronicsPlan1Url : isElectricalLessonFormat2 ? electricalPlan2Url : isElectricalLessonFeatured ? electricalPlanUrl : isEnglishLessonFeatured ? englishPlanUrl : isScienceLessonFeatured ? sciencePlanUrl : timePlanUrl;
    const planFileName = isElectronicsLessonFeatured ? "แผนการจัดการเรียนรู้_โครงสร้างอะตอม.docx" : isElectricalLessonFeatured ? "แผนการจัดการเรียนรู้_ไฟฟ้ากระแสสลับ.docx" : isEnglishLessonFeatured ? "แผนการจัดการเรียนรู้_ภาษาอังกฤษ_ป.4.docx" : isScienceLessonFeatured ? "แผนการจัดการเรียนรู้_วิทยาศาสตร์_ป.1.docx" : "แผนการจัดการเรียนรู้_เวลา.docx";
    const videoUrl = isElectronicsLessonFormat2 ? electronicsVideo2Url : isElectronicsLessonFeatured ? electronicsVideoUrl : isElectricalLessonFormat2 ? electricalVideo2Url : isElectricalLessonFeatured ? electricalVideoUrl : isEnglishLessonFeatured ? englishVideoUrl : isScienceLessonFeatured ? scienceVideoUrl : timeVideoUrl;
    const videoFileName = isElectronicsLessonFeatured ? "electronics_lesson.mp4" : isElectricalLessonFeatured ? "electrical_ac_lesson.mp4" : isEnglishLessonFeatured ? "user_77_proj_958_1775707189301_BAD.mp4" : isScienceLessonFeatured ? "body_parts_BEST.mp4" : "time_lesson.mp4";
    const songUrl = isEnglishLessonFeatured ? englishSongUrl : isScienceLessonFeatured ? scienceSongUrl : timeSongUrl;
    const songFileName = isEnglishLessonFeatured ? "In My House.mp3" : isScienceLessonFeatured ? "ร่างกาย.mp3" : "นาฬิกาและนาที.mp3";
    const songLyrics = isEnglishLessonFeatured ? englishSongLyrics : isScienceLessonFeatured ? scienceSongLyrics : featuredSongLyrics;
    const slidesLessonUrl = isElectronicsLessonFormat2 ? electronicsSlidesLesson2Url : isElectronicsLessonFeatured ? electronicsSlidesLessonUrl : isElectricalLessonFormat2 ? electricalSlidesLesson2Url : isElectricalLessonFeatured ? electricalSlidesLessonUrl : isEnglishLessonFeatured ? englishSlidesLessonUrl : isScienceLessonFeatured ? scienceSlidesLessonUrl : timeSlidesLessonUrl;
    const slidesLessonGammaUrl = isEnglishLessonFeatured ? englishSlidesLessonGammaUrl : isScienceLessonFeatured ? scienceSlidesLessonGammaUrl : timeSlidesLessonGammaUrl;
    const slidesLessonFileName = isElectronicsLessonFeatured ? "slide_electronics_lesson.pptx" : isElectricalLessonFeatured ? "slide_electrical_lesson.pptx" : isEnglishLessonFeatured ? "slide เนื้อหา.pptx" : isScienceLessonFeatured ? "slide สอน.pptx" : "slide lesson.pptx";
    const slidesActivityUrl = isElectronicsLessonFeatured ? electronicsSlidesActivity1Url : isElectricalLessonFormat2 ? electricalSlidesActivity2Url : isElectricalLessonFeatured ? electricalSlidesActivity1Url : isEnglishLessonFeatured ? englishSlidesActivityUrl : isScienceLessonFeatured ? scienceSlidesActivityUrl : timeSlidesActivityUrl;
    const slidesActivity2Url = isElectronicsLessonFeatured ? electronicsSlidesActivity2Url : isElectricalLessonFormat2 ? electricalSlidesActivity2Url : electricalSlidesActivity1Url;
    const slidesActivityGammaUrl = isEnglishLessonFeatured ? englishSlidesActivityGammaUrl : isScienceLessonFeatured ? scienceSlidesActivityGammaUrl : timeSlidesActivityGammaUrl;
    const slidesActivityFileName = isElectronicsLessonFeatured ? "slide_electronics_activity.pptx" : isElectricalLessonFeatured ? "slide กิจกรรม.pptx" : isEnglishLessonFeatured ? "slide กิจกรรม.pptx" : isScienceLessonFeatured ? "slide กิจกรรมแบบที่ 1.pptx" : "slide activity.pptx";
    const examUrl = isElectronicsLessonFeatured ? electronicsExamUrl : isElectricalLessonFormat2 ? electricalExam2Url : isElectricalLessonFeatured ? electricalExamUrl : isEnglishLessonFeatured ? englishExamUrl : isScienceLessonFeatured ? scienceExamUrl : timeExamUrl;
    const answerUrl = isElectronicsLessonFeatured ? electronicsExamUrl : isElectricalLessonFormat2 ? electricalAnswer2Url : isElectricalLessonFeatured ? electricalAnswerUrl : isEnglishLessonFeatured ? englishAnswerUrl : isScienceLessonFeatured ? scienceAnswerUrl : timeAnswerUrl;
    const examFileName = isElectronicsLessonFeatured ? "exam_electronics.docx" : isElectricalLessonFeatured ? "exam_electrical.docx" : isEnglishLessonFeatured ? "exam_eng_p.4.docx" : isScienceLessonFeatured ? "sci_exam_p1.docx" : "exam_time_p2.docx";
    const answerFileName = isElectronicsLessonFeatured ? "answer_electronics.docx" : isElectricalLessonFeatured ? "answer_electrical.docx" : isEnglishLessonFeatured ? "answer_eng_p.4.docx" : isScienceLessonFeatured ? "answer_sci_p1.docx" : "answer_math_p2.docx";

    switch (tabValue) {
      case "lesson-content":
        if (isElectricalLessonFeatured && tabValue === "lesson-content") {
          return (
            <div className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">เนื้อหาการเรียน</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{cleanedTopic}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">เนื้อหาที่ AI สร้างขึ้นจากข้อมูลของคุณ</p>
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto rounded-2xl border bg-muted/10 p-6">
                <div className="whitespace-pre-wrap text-sm leading-8 text-foreground font-normal">
                  {contentToDisplay}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                >
                  <Download className="h-4 w-4" />
                  ดาวน์โหลด
                </a>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">เนื้อหาการเรียน</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{cleanedTopic}</h3>
                <p className="mt-2 text-sm text-muted-foreground">เนื้อหาที่ AI สร้างขึ้นจากข้อมูลของคุณ</p>
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto rounded-2xl border bg-muted/10 p-6">
              <div className="whitespace-pre-wrap text-sm leading-8 text-foreground font-normal">
                {shouldShowFeaturedMockup ? contentToDisplay : draft.lessonContent || "เนื้อหาการเรียนจะปรากฏหลังจากการสร้างเสร็จสิ้น"}
              </div>
            </div>

            {shouldShowFeaturedMockup && (
              <div className="flex flex-wrap gap-3">
                <a
                  href={contentUrl}
                  download={isTimeLessonFeatured || isEnglishLessonFeatured || isScienceLessonFeatured || isElectronicsLessonFeatured ? undefined : contentFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                >
                  <Download className="h-4 w-4" />
                  ดาวน์โหลด
                </a>
              </div>
            )}
          </div>
        );

      case "lesson-plan":
        if ((isElectricalLessonFeatured || isElectronicsLessonFeatured) && tabValue === "lesson-plan") {
          const plan1Url = isElectronicsLessonFeatured ? electronicsPlan1Url : "https://docs.google.com/document/d/1BjrPwA6xsBfwVQNDsuF4wmFTkDY6cXu3/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
          const plan2Url = isElectronicsLessonFeatured ? electronicsPlan2Url : "https://docs.google.com/document/d/1hLdTgKpg2IimQH4OVcTT8zTt8Ts_iSsb/edit?usp=sharing&ouid=113859264124309761899&rtpof=true&sd=true";
          return (
            <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">แผนการจัดการเรียนรู้</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{cleanedTopic}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">แผนการจัดการเรียนรู้ฉบับสมบูรณ์</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">แผนการจัดการเรียนรู้เรื่อง {cleanedTopic} - กิจกรรมแบบที่ 1</div>
                    <div className="text-xs text-muted-foreground">{draft.major ? `${draft.major} · ${draft.subject}` : `${draft.subject}`}</div>
                  </div>
                  <a
                    href={plan1Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">แผนการจัดการเรียนรู้เรื่อง {cleanedTopic} - กิจกรรมแบบที่ 2</div>
                    <div className="text-xs text-muted-foreground">{draft.major ? `${draft.major} · ${draft.subject}` : `${draft.subject}`}</div>
                  </div>
                  <a
                    href={plan2Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">แผนการจัดการเรียนรู้</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{lessonPlanTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">แผนการจัดการเรียนรู้ฉบับสมบูรณ์</p>
              </div>
            </div>

            {shouldShowFeaturedMockup ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">{lessonPlanTitle}</div>
                  <div className="text-xs text-muted-foreground">{draft.major ? `${draft.major} · ${draft.subject}` : `${draft.subject}`}</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={planUrl}
                    download={isTimeLessonFeatured || isEnglishLessonFeatured || isScienceLessonFeatured || isElectronicsLessonFeatured ? undefined : planFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-8">
                <p className="text-sm text-muted-foreground">ตัวอย่างแผนการสอน</p>
              </div>
            )}
          </div>
        );

      case "video":
        if ((isElectricalLessonFeatured || isElectronicsLessonFeatured) && tabValue === "video") {
          return (
            <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">วีดีโอ</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{cleanedTopic}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">วีดีโอการสอนแบบมีความคิดสร้างสรรค์</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">วีดีโอเรื่อง {cleanedTopic}</div>
                  <div className="text-xs text-muted-foreground">วีดีโอการสอนแบบมีความคิดสร้างสรรค์</div>
                </div>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                >
                  <Download className="h-4 w-4" />
                  ดาวน์โหลด
                </a>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">วีดีโอ</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{lessonPlanTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">วีดีโอการสอนแบบมีความคิดสร้างสรรค์</p>
              </div>
            </div>

            {shouldShowFeaturedMockup ? (
              <>
                {!isTimeLessonFeatured && !isEnglishLessonFeatured && !isScienceLessonFeatured && !isElectronicsLessonFeatured && (
                  <div className="mt-4 overflow-hidden rounded-2xl border bg-black">
                    <video controls className="aspect-video w-full bg-black" preload="metadata">
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">วีดีโอเรื่อง {lessonPlanTitle}</div>
                    <div className="text-xs text-muted-foreground">วีดีโอการสอนแบบมีความคิดสร้างสรรค์</div>
                  </div>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-8">
                <p className="text-sm text-muted-foreground">ตัวอย่างวีดีโอการสอน</p>
              </div>
            )}
          </div>
        );

      case "song":
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">เพลง</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">เพลงเรื่อง {cleanedTopic}</h3>
                <p className="mt-2 text-sm text-muted-foreground">บทเพลงเพื่อการเรียน</p>
              </div>
            </div>

            {shouldShowFeaturedMockup ? (
              <>
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cleanedTopic}</p>
                      <p className="mt-1 text-xs text-muted-foreground">บทเพลงสำหรับการสอน</p>
                    </div>
                  </div>

                  <div className="mt-4 max-h-64 overflow-y-auto rounded-2xl border bg-background p-4 text-sm leading-7 text-foreground whitespace-pre-wrap">
                    {songLyrics}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={isTimeLessonFeatured ? undefined : songFileName}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลดเพลง
                  </a>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-8">
                <p className="text-sm text-muted-foreground">ตัวอย่างเพลง</p>
              </div>
            )}
          </div>
        );

      case "slides-lesson":
        if ((isElectricalLessonFeatured || isElectronicsLessonFeatured) && tabValue === "slides-lesson") {
          return (
            <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">สไลด์การสอน</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{cleanedTopic}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">หน้าปกและเป้าหมายการเรียนรู้</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">สไลด์การสอนเรื่อง {cleanedTopic}</div>
                  <div className="text-xs text-muted-foreground">หน้าปกและเป้าหมายการเรียนรู้</div>
                </div>
                <a
                  href={slidesLessonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                >
                  <Download className="h-4 w-4" />
                  ดาวน์โหลด
                </a>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">สไลด์การสอน</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">สไลด์การสอนเรื่อง {cleanedTopic}</h3>
                <p className="mt-2 text-sm text-muted-foreground">หน้าปกและเป้าหมายการเรียนรู้</p>
              </div>
            </div>

            {shouldShowFeaturedMockup ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">สไลด์การสอนเรื่อง {cleanedTopic}</div>
                  <div className="text-xs text-muted-foreground">หน้าปกและเป้าหมายการเรียนรู้</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={isTimeLessonFeatured || isEnglishLessonFeatured || isScienceLessonFeatured ? slidesLessonUrl : slidesLessonGammaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden"
                  >
                    ดู
                  </a>
                  <a
                    href={slidesLessonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={isTimeLessonFeatured || isEnglishLessonFeatured || isScienceLessonFeatured || isElectronicsLessonFeatured ? undefined : slidesLessonFileName}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-8">
                <p className="text-sm text-muted-foreground">ตัวอย่างสไลด์การสอน</p>
              </div>
            )}
          </div>
        );

      case "slides-activity":
        if ((isElectricalLessonFeatured || isElectronicsLessonFeatured) && tabValue === "slides-activity") {
          return (
            <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">สไลด์กิจกรรม</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{cleanedTopic}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">รูปแบบกิจกรรมการเรียน</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Activity Type 1 */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">สไลด์กิจกรรมแบบที่ 1 — การเรียนรู้เชิงสำรวจ</div>
                  </div>
                  <a
                    href={isElectronicsLessonFeatured ? electronicsSlidesActivity1Url : electricalSlidesActivity1Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>

                {/* Activity Type 2 */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">สไลด์กิจกรรมแบบที่ 2 — การเรียนรู้ผ่านกิจกรรมและบทบาทสมมติ</div>
                  </div>
                  <a
                    href={isElectronicsLessonFeatured ? electronicsSlidesActivity2Url : electricalSlidesActivity2Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">สไลด์กิจกรรม</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">สไลด์กิจกรรมเรื่อง {cleanedTopic}</h3>
                <p className="mt-2 text-sm text-muted-foreground">รูปแบบกิจกรรมการเรียน</p>
              </div>
            </div>

            {shouldShowFeaturedMockup ? (
              <div className="space-y-4">
                {/* Activity Type 1 */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">สไลด์กิจกรรมแบบที่ 1 — การเรียนรู้เชิงสำรวจ</div>
                  </div>
                  <a
                    href={slidesActivityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={isTimeLessonFeatured || isEnglishLessonFeatured || isScienceLessonFeatured || isElectronicsLessonFeatured ? undefined : slidesActivityFileName}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>

                {/* Activity Type 2 */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">สไลด์กิจกรรมแบบที่ 2 — การเรียนรู้ผ่านกิจกรรมและบทบาทสมมติ</div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </button>
                </div>

                {/* Activity Type 3 */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">สไลด์กิจกรรมแบบที่ 3 — การเรียนรู้ผ่านศิลปะและการสร้างสรรค์</div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-8">
                <p className="text-sm text-muted-foreground">ตัวอย่างสไลด์กิจกรรม</p>
              </div>
            )}
          </div>
        );

      case "quiz":
        const qrCodeUrl = "https://drive.google.com/file/d/1qnIM6buzrJUqZ58WH58tFhJCwFJ538YA/view?usp=sharing";
        if ((isElectricalLessonFeatured || isElectronicsLessonFeatured) && tabValue === "quiz") {
          const quizQrUrl = isElectronicsLessonFeatured ? electronicsQrUrl : isElectricalLessonFormat2 ? electricalQr2Url : electricalQrUrl;
          return (
            <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">แบบฝึกหัด</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{cleanedTopic}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">ดาวน์โหลดแบบฝึกหัดและเฉลย</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">แบบฝึกหัดและเฉลย</div>
                  </div>
                  <a
                    href={examUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>

                <div className="hidden flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">แบบฝึกหัด QR Code</div>
                  </div>
                  <a
                    href={quizQrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">แบบฝึกหัด</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{quizTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">ดาวน์โหลดแบบฝึกหัดและเฉลย</p>
              </div>
            </div>

            {shouldShowFeaturedMockup ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">แบบฝึกหัด</div>
                  </div>
                  <a
                    href={examUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">เฉลยแบบฝึกหัด</div>
                  </div>
                  <a
                    href={answerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>

                <div className="hidden flex items-center justify-between gap-3 rounded-2xl border bg-muted/20 px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">แบบฝึกหัด QR Code</div>
                  </div>
                  <a
                    href={qrCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลด
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-8">
                <p className="text-sm text-muted-foreground">ตัวอย่างแบบฝึกหัด</p>
              </div>
            )}
          </div>
        );

      case "game":
        const gameUrl = "https://game-quiz-race-client.onrender.com/quizrace";
        return (
          <div className="space-y-4 rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">เกม</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{gameTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">เกมการเรียนแบบโต้ตอบ</p>
              </div>
            </div>

            {shouldShowFeaturedMockup ? (
              <>
                <div className="rounded-2xl border bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground">{gameTitle}</p>
            <p className="mt-2 break-all text-sm text-muted-foreground">{gameUrl}</p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2Fe8725b92c7ff4791ba648f2232fe49d9"
              alt="QR Code for Game"
              className="h-48 w-48 rounded-lg border border-border shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-sm font-medium text-white transition-colors hover:bg-secondary/80"
            >
              <ExternalLink className="h-4 w-4" />
              เล่นเกม
            </a>
          </div>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-8">
                <p className="text-sm text-muted-foreground">ตัวอย่างเกมการเรียน</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-full bg-secondary text-white hover:bg-secondary/80"
          >
            <Save className="h-4 w-4" />
            บันทึก
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">สื่อประกอบการสอน</h1>
          <p className="text-muted-foreground">ดาวน์โหลดและใช้สื่อการสอนที่ AI สร้างให้คุณ</p>
        </div>

        <section className="animate-in fade-in duration-500 rounded-2xl border border-border bg-card p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-3 lg:grid-cols-4">
              {tabOptions.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground data-[state=active]:border-secondary data-[state=active]:bg-secondary data-[state=active]:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="space-y-4 outline-none data-[state=active]:animate-[dashboardFadeIn_0.35s_ease-out_both]"
                >
                  {shouldShowFeaturedMockup ? renderTabContent(tab.value) : renderGenericTabContent(tab.label, Icon)}
                </TabsContent>
              );
            })}
          </Tabs>
        </section>
      </div>
    </DashboardLayout>
  );
}
