const translations = {
  en: {
    nav_home: "Home",
    nav_submit: "Submit Report",
    nav_track: "Track Report",
    nav_report_now: "Report Now",
    nav_light_mode: "Light Mode",
    nav_dark_mode: "Dark Mode",
    
    hero_badge: "100% Anonymous & Encrypted",
    hero_title_1: "Expose the truth.",
    hero_title_2: "Stay untouchable.",
    hero_subtitle: "SecureVoice is a military-grade anonymous whistleblowing platform. Your identity is protected by AES-256 encryption. No IP addresses stored. No personal data exposed.",
    hero_btn_submit: "Submit Anonymous Report",
    hero_btn_track: "Track Existing Report",
    
    badge_aes: "AES-256 Encrypted",
    badge_ip: "No IP Logged",
    badge_csrf: "CSRF Protected",
    badge_leak: "Zero Identity Leak",

    feat_title: "Why SecureVoice?",
    feat_sub: "Built with cybersecurity-first principles to protect every whistleblower.",
    feat_1_title: "End-to-End Encryption",
    feat_1_desc: "All sensitive data encrypted with AES-256-CBC. Unique IV per record. No plaintext ever stored.",
    feat_2_title: "Anonymous Submission",
    feat_2_desc: "IP addresses are hashed using SHA-256 with a salt. Your identity is mathematically impossible to retrieve.",
    feat_3_title: "Integrity Chain",
    feat_3_desc: "Blockchain-style hash chaining ensures no report can be silently altered after submission.",
    feat_4_title: "Acknowledgement Number",
    feat_4_desc: "Receive a unique tracking code to follow up on your report — no account required.",
    feat_5_title: "AI Risk Scoring",
    feat_5_desc: "Each report is automatically analyzed for severity and risk using keyword intelligence.",
    feat_6_title: "Threat Detection",
    feat_6_desc: "Automated detection of spam, duplicate reports, and abnormal submission patterns.",

    hiw_title: "How It Works",
    hiw_sub: "Simple, secure, and fully anonymous in 3 steps.",
    hiw_1_title: "Submit Your Report",
    hiw_1_desc: "Fill out the secure form. Your identity is never required. Evidence files are securely stored with metadata stripped.",
    hiw_2_title: "Get Acknowledgement",
    hiw_2_desc: "Receive a unique tracking number (e.g. SV-20240115-A3F2B1C9). Save it — this is your only link to the report.",
    hiw_3_title: "Track Progress",
    hiw_3_desc: "Use your acknowledgement number to check the status anytime. Investigators work behind the scenes.",

    cta_title: "Ready to report corruption?",
    cta_sub: "Your voice matters. Your identity stays protected.",
    cta_btn: "Start Anonymous Report",

    submit_title: "Submit Anonymous Report",
    submit_sub: "Your connection is encrypted. No IP addresses or personal identifiable information (PII) are being logged.",
    submit_req: "Required Information",
    submit_type: "Incident Type",
    submit_type_ph: "Select the type of incident",
    submit_desc: "Incident Description",
    submit_desc_ph: "Provide detailed information about what happened...",
    submit_opt: "Optional Evidence",
    submit_audio: "Voice Record (Optional)",
    submit_audio_desc: "You can securely record a voice note or upload audio evidence.",
    submit_files: "Upload Files (Max 5MB per file, max 3 files)",
    submit_sec: "Security Verification",
    submit_confirm: "I confirm that I am submitting this information anonymously and understand that I cannot edit this report after submission to preserve evidence integrity.",
    submit_btn: "Submit Secure Report",

    track_title: "Track Report",
    track_sub: "Enter your secure acknowledgement number to check the status of your anonymous report.",
    track_input: "Acknowledgement Number",
    track_input_ph: "e.g., SV-20240417-A1B2C3D4",
    track_btn: "Verify & Track Status",
    
    footer_tagline: "Speak the truth without fear. Fully anonymous whistleblowing platform built with zero-trust architecture.",
    footer_quick: "Quick Links",
    footer_legal: "Legal & Privacy",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_rights: "SecureVoice. All rights reserved."
  },
  hi: {
    nav_home: "मुखपृष्ठ",
    nav_submit: "रिपोर्ट दर्ज करें",
    nav_track: "रिपोर्ट ट्रैक करें",
    nav_report_now: "अभी रिपोर्ट करें",
    nav_light_mode: "लाइट मोड",
    nav_dark_mode: "डार्क मोड",
    
    hero_badge: "100% अनाम और एन्क्रिप्टेड",
    hero_title_1: "सच का खुलासा करें।",
    hero_title_2: "पहुंच से बाहर रहें।",
    hero_subtitle: "सिक्योरवॉयस एक सैन्य-ग्रेड अनाम व्हिसलब्लोइंग प्लेटफॉर्म है। आपकी पहचान AES-256 एन्क्रिप्शन द्वारा सुरक्षित है। कोई आईपी एड्रेस या व्यक्तिगत डेटा सेव नहीं होता।",
    hero_btn_submit: "अनाम रिपोर्ट दर्ज करें",
    hero_btn_track: "मौजूदा रिपोर्ट ट्रैक करें",
    
    badge_aes: "AES-256 एन्क्रिप्टेड",
    badge_ip: "कोई आईपी लॉग नहीं",
    badge_csrf: "CSRF सुरक्षित",
    badge_leak: "जीरो आइडेंटिटी लीक",

    feat_title: "सिक्योरवॉयस क्यों?",
    feat_sub: "साइबर सुरक्षा-प्रथम सिद्धांतों के साथ निर्मित जो हर व्हिसलब्लोअर की रक्षा करते हैं।",
    feat_1_title: "एंड-टू-एंड एन्क्रिप्शन",
    feat_1_desc: "सभी संवेदनशील डेटा AES-256-CBC से एन्क्रिप्टेड है। कोई भी डेटा सादे पाठ में संग्रहीत नहीं है।",
    feat_2_title: "गुमनाम सबमिशन",
    feat_2_desc: "आईपी एड्रेस SHA-256 और साल्ट का उपयोग करके हैश किए जाते हैं। आपकी पहचान का पता लगाना गणितीय रूप से असंभव है।",
    feat_3_title: "इंटेग्रिटी चेन",
    feat_3_desc: "ब्लॉकचेन-शैली हैश चेनिंग से यह सुनिश्चित होता है कि सबमिट करने के बाद कोई भी रिपोर्ट चुपचाप बदली नहीं जा सकती।",
    feat_4_title: "अक्नोलेजमेंट नंबर",
    feat_4_desc: "अपनी रिपोर्ट पर फॉलो-अप के लिए एक ट्रैक कोड प्राप्त करें — कोई खाता आवश्यक नहीं है।",
    feat_5_title: "एआई रिस्क स्कोरिंग",
    feat_5_desc: "प्रत्येक रिपोर्ट का एआई-आधारित टूल द्वारा गंभीरता के लिए स्वचालित रूप से विश्लेषण किया जाता है।",
    feat_6_title: "थ्रेट डिटेक्शन",
    feat_6_desc: "स्पैम, डुप्लिकेट और असामान्य रिपोर्टों का स्वचालित पता लगाना।",

    hiw_title: "यह कैसे काम करता है",
    hiw_sub: "3 चरणों में सरल, सुरक्षित और पूरी तरह से गुमनाम।",
    hiw_1_title: "अपनी रिपोर्ट सबमिट करें",
    hiw_1_desc: "सुरक्षित फ़ॉर्म भरें। आपकी पहचान कभी नहीं पूछी जाती है। सबूत फ़ाइलें सुरक्षित रूप से संग्रहीत की जाती हैं।",
    hiw_2_title: "रसीद प्राप्त करें",
    hiw_2_desc: "एक अद्वितीय ट्रैकिंग नंबर प्राप्त करें। इसे सहेज कर रखें — यह रिपोर्ट से आपका एकमात्र लिंक है।",
    hiw_3_title: "प्रगति ट्रैक करें",
    hiw_3_desc: "किसी भी समय स्थिति जांचने के लिए अपने नंबर का उपयोग करें। अन्वेषक पर्दे के पीछे काम करते हैं।",

    cta_title: "भ्रष्टाचार की रिपोर्ट करने के लिए तैयार हैं?",
    cta_sub: "आपकी आवाज़ मायने रखती है। आपकी पहचान सुरक्षित रहती है।",
    cta_btn: "अनाम रिपोर्ट शुरू करें",

    submit_title: "अनाम रिपोर्ट दर्ज करें",
    submit_sub: "आपका कनेक्शन एन्क्रिप्टेड है। कोई आईपी एड्रेस या व्यक्तिगत जानकारी नहीं लॉग हो रही है।",
    submit_req: "आवश्यक जानकारी",
    submit_type: "घटना का प्रकार",
    submit_type_ph: "घटना का प्रकार चुनें",
    submit_desc: "घटना का विवरण",
    submit_desc_ph: "क्या हुआ, इसके बारे में विस्तृत जानकारी दें...",
    submit_opt: "वैकल्पिक साक्ष्य",
    submit_audio: "वॉयस रिकॉर्ड (वैकल्पिक)",
    submit_audio_desc: "आप ऑडियो सबूत भी सुरक्षित रूप से अपलोड कर सकते हैं।",
    submit_files: "फ़ाइलें अपलोड करें (प्रति फ़ाइल अधिकतम 5MB, 3 फ़ाइलें)",
    submit_sec: "सुरक्षा सत्यापन",
    submit_confirm: "मैं पुष्टि करता हूं कि मैं यह जानकारी गुमनाम रूप से प्रस्तुत कर रहा हूं और समझता हूं कि सबूत की अखंडता को बनाए रखने के लिए सबमिशन के बाद संपादन नहीं किया जा सकता है।",
    submit_btn: "सुरक्षित रिपोर्ट सबमिट करें",

    track_title: "रिपोर्ट ट्रैक करें",
    track_sub: "अपनी गुमनाम रिपोर्ट की स्थिति जांचने के लिए अपना सुरक्षित नंबर दर्ज करें।",
    track_input: "स्वीकृति संख्या (Number)",
    track_input_ph: "जैसे, SV-20240417-A1B2C3D4",
    track_btn: "सत्यापित करें और स्थिति ट्रैक करें",
    
    footer_tagline: "बिना डरे सच बोलें। शून्य-ट्रस्ट आर्किटेक्चर के साथ बनाया गया पूरी तरह से गुमनाम व्हिसलब्लोइंग प्लेटफॉर्म।",
    footer_quick: "त्वरित लिंक (Quick Links)",
    footer_legal: "कानूनी (Legal) ",
    footer_privacy: "गोपनीयता नीति (Privacy Policy)",
    footer_terms: "सेवा की शर्तें (Terms of Service)",
    footer_rights: "सिक्योरवॉयस। सर्वाधिकार सुरक्षित।"
  },
  hinglish: {
    nav_home: "Home",
    nav_submit: "Report Darj Karein",
    nav_track: "Report Track Karein",
    nav_report_now: "Abhi Report Karein",
    nav_light_mode: "Light Mode",
    nav_dark_mode: "Dark Mode",
    
    hero_badge: "100% Anonymous aur Encrypted",
    hero_title_1: "Sach ka khulasa karein.",
    hero_title_2: "Pahunch se bahar rahein.",
    hero_subtitle: "SecureVoice ek military-grade anonymous whistleblowing platform hai. Aapki identity AES-256 encryption se protected hai. Koi IP address ya personal data save nahi hota.",
    hero_btn_submit: "Anonymous Report Submit Karein",
    hero_btn_track: "Apni Report Track Karein",
    
    badge_aes: "AES-256 Encrypted",
    badge_ip: "Koi IP Logged Nahi",
    badge_csrf: "CSRF Protected",
    badge_leak: "Zero Identity Leak",

    feat_title: "SecureVoice Kyun?",
    feat_sub: "Cybersecurity ke strong principles par bana hai jo har whistleblower ko protect karta hai.",
    feat_1_title: "End-to-End Encryption",
    feat_1_desc: "Saara sensitive data AES-256-CBC se encrypted hai. Plane text kabhi store nahi hota.",
    feat_2_title: "Anonymous Submission",
    feat_2_desc: "IP addresses SHA-256 aur salt ke through hashed hain. Identity trace karna bilkul impossible hai.",
    feat_3_title: "Integrity Chain",
    feat_3_desc: "Blockchain style hashing ensure karti hai ki report submit hone ke baad badli na ja sake.",
    feat_4_title: "Acknowledgement Number",
    feat_4_desc: "Report ka status check karne ke liye ek unique code milta hai — account banana zaroori nahi.",
    feat_5_title: "AI Risk Scoring",
    feat_5_desc: "Har report ko AI automatically analyze karke uski severity aur risk score banata hai.",
    feat_6_title: "Threat Detection",
    feat_6_desc: "Spam, duplicate ya abnormal activity automatically detect hoti hai.",

    hiw_title: "Kaise Kaam Karta Hai",
    hiw_sub: "Sirf 3 steps mein simple, secure aur fully anonymous process.",
    hiw_1_title: "Apni Report Submit Karein",
    hiw_1_desc: "Secure form bharein. Aapki details kabhi nahi puchi jaayengi. Files safely store hongi.",
    hiw_2_title: "Acknowledgement lein",
    hiw_2_desc: "Ek unique tracking number generate hoga. Isey save karein — sirf yahi number aapko status check karne me help karega.",
    hiw_3_title: "Progress Track Karein",
    hiw_3_desc: "Apne number se status check karein jab bhi chahiye. Investigators silently backend me kaam karenge.",

    cta_title: "Corruption ke khilaf awaaz uthane ke liye ready hain?",
    cta_sub: "Apni baat saamne layein. Aapki details safe rahengi.",
    cta_btn: "Start Anonymous Report",

    submit_title: "Anonymous Report Submit Karein",
    submit_sub: "Aapka connection encrypted hai. Koi bhi personal identity trace nahi ki jayegi.",
    submit_req: "Zaroori Information",
    submit_type: "Incident ka Type",
    submit_type_ph: "Select karein kya incident hua hai",
    submit_desc: "Incident ki Details",
    submit_desc_ph: "Incident ke barey mein details me bayan karein...",
    submit_opt: "Extra Saboot (Optional)",
    submit_audio: "Voice Recording (Optional)",
    submit_audio_desc: "Aap chahein toh directly voice record kar sakte hain ya audio evidence upload kar sakte hain.",
    submit_files: "Files Upload Karein (Max 5MB per file, 3 allowed)",
    submit_sec: "Security Verification",
    submit_confirm: "Main confirm karta hoon ki main details anonymously de raha hoon aur samajhta hoon ki proof ki sachai banaye rakhne ke liye me ye report dobara edit nahi kar parunga.",
    submit_btn: "Secure Report Submit Karein",

    track_title: "Report Status Track Karein",
    track_sub: "Apna secure acknowledgement number daalein aur report ka status check karein.",
    track_input: "Acknowledgement Number",
    track_input_ph: "Example, SV-20240417-A1B2C3D4",
    track_btn: "Verify kar ke status dekhein",
    
    footer_tagline: "Bina darey sach bolein. Fully anonymous platform jo aapki identity safe rakhta hai.",
    footer_quick: "Quick Links",
    footer_legal: "Legal & Privacy",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_rights: "SecureVoice. All rights reserved."
  }
};

function updateContent() {
  const currentLang = localStorage.getItem('site_lang') || 'en';
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      // Replace only text content, preserve any child icons
      // if child consists of <i> tags we want to keep them
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = '';
        el.appendChild(icon);
        el.innerHTML += ' ' + translations[currentLang][key];
      } else {
        // preserve accent span from hero title if it exists
        if(key === 'hero_title_2') {
          el.innerHTML = '<span class="accent">' + translations[currentLang][key] + '</span>';
        } else {
           // For simple text inputs
           if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.placeholder = translations[currentLang][key];
           } else if (el.tagName === 'OPTION') { // handle selects
              el.textContent = translations[currentLang][key];
           } else {
              el.textContent = translations[currentLang][key];
           }
        }
      }
    }
  });

  // handle dark/light mode toggle text which is dynamic
  const themeToggleLabel = document.documentElement.getAttribute('data-theme') === 'light' 
    ? 'nav_dark_mode' : 'nav_light_mode';
    
  let themeNode = document.querySelector('.theme-label');
  if(themeNode && translations[currentLang][themeToggleLabel]) {
    themeNode.textContent = translations[currentLang][themeToggleLabel];
  }
}

document.addEventListener('DOMContentLoaded', () => {
    updateContent();

    // Attach event listeners to the language selector dropdown
    const langSelect = document.getElementById('lang-selector');
    if (langSelect) {
      langSelect.value = localStorage.getItem('site_lang') || 'en';
      langSelect.addEventListener('change', (e) => {
        localStorage.setItem('site_lang', e.target.value);
        updateContent();
      });
    }
});
