var FIREBASE_DB_URL = "https://pinksphere-hub-default-rtdb.firebaseio.com/groups.json";
var FIREBASE_REPORTS_URL = "https://pinksphere-hub-default-rtdb.firebaseio.com/reports.json";
var DEFAULT_WA_IMG = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

var selectedGroupLink = "";
var reportingGroupTitle = "";

var categories = [
  "Adult/18+/Hot", "Art/Design/Photography", "Auto/Vehicle", "Business/Advertising/Marketing",
  "Comedy/Funny", "Dating/Flirting/Chatting", "Education/School", "Entertainment/Masti",
  "Family/Relationships", "Fan Club/Celebrities", "Fashion/Style/Clothing", "Film/Animation",
  "Food/Drinks", "Gaming/Apps", "Health/Beauty/Fitness", "Jobs/Career", "Money/Earning",
  "Music/Audio/Songs", "News/Magazines/Politics", "Pets/Animals/Nature", "Roleplay/Comics",
  "Science/Technology", "Shopping/Buy/Sell", "Social/Friendship/Community", "Spiritual/Devotional",
  "Sports/Games", "Thoughts/Quotes/Jokes", "Travel/Local/Place"
];

var countries = [
  "India", "Pakistan", "United States", "United Kingdom", "United Arab Emirates",
  "Saudi Arabia", "Algeria", "Argentina", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina",
  "Brazil", "Bulgaria", "Canada", "Chile", "China", "Colombia", "Croatia", "Czechia",
  "Denmark", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany",
  "Ghana", "Greece", "Hong Kong", "Iceland", "Indonesia", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia",
  "Lebanon", "Libya", "Lithuania", "Luxembourg", "Macedonia", "Malawi", "Malaysia",
  "Mexico", "Montenegro", "Morocco", "Mozambique", "Nepal", "Netherlands", "New Zealand",
  "Nigeria", "Norway", "Oman", "Panama", "Peru", "Philippines", "Poland", "Portuguese",
  "Puerto Rico", "Qatar", "Romania", "Russia", "Senegal", "Serbia", "Singapore",
  "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden",
  "Switzerland", "Taiwan", "Tanzania", "Thailand", "Togo", "Tunisia", "Turkey",
  "Uganda", "Ukraine", "Venezuela", "Vietnam", "Yemen", "Zimbabwe", "Worldwide / Global"
];

var languages = [
  "English", "Hindi", "Punjabi", "Urdu", "Tamil", "Telugu", "Afrikaans", "Albanian",
  "Amharic", "Arabic", "Armenian", "Azerbaijani", "Bangla", "Basque", "Belarusian",
  "Bosnian", "Bulgarian", "Catalan", "Chinese", "Croatian", "Czech", "Danish", "Dutch",
  "Estonian", "Filipino", "Finnish", "French", "Galician", "Georgian", "German",
  "Greek", "Gujarati", "Hebrew", "Hungarian", "Icelandic", "Indonesian", "Italian",
  "Japanese", "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish", "Kyrgyz", "Lao",
  "Latvian", "Lithuanian", "Macedonian", "Malay", "Malayalam", "Marathi", "Mongolian",
  "Myanmar", "Nepali", "Norwegian", "Persian", "Polish", "Portuguese", "Romanian",
  "Russian", "Serbian", "Sinhala", "Slovak", "Slovenian", "Spanish", "Swahili",
  "Swedish", "Thai", "Turkish", "Ukrainian", "Uzbek", "Vietnamese", "Zulu"
];

var groupsData = [];

function sanitize(str) {
  return String(str || '').replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

function initDropdowns() {
  var fCat = document.getElementById('filterCategory');
  var fCount = document.getElementById('filterCountry');
  var fLang = document.getElementById('filterLanguage');
  var inCat = document.getElementById('inCat');
  var inCount = document.getElementById('inCountry');
  var inLang = document.getElementById('inLang');

  if(fCat) fCat.innerHTML = '<option value="All">All Categories</option>' + categories.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('');
  if(fCount) fCount.innerHTML = '<option value="All">All Countries</option>' + countries.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('');
  if(fLang) fLang.innerHTML = '<option value="All">All Languages</option>' + languages.map(function(l){ return '<option value="'+l+'">'+l+'</option>'; }).join('');

  if(inCat) inCat.innerHTML = categories.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('');
  if(inCount) inCount.innerHTML = countries.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('');
  if(inLang) inLang.innerHTML = languages.map(function(l){ return '<option value="'+l+'">'+l+'</option>'; }).join('');
}

function getStatusBadge() {
  return '<span class="badge-status badge-active">🟢 Active</span>';
}

function renderList(list) {
  var container = document.getElementById('groupGrid');
  if (!container) return;
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = '<div style="background:white; padding:25px; text-align:center; border-radius:10px; color:#64748b;">Loading WhatsApp Groups...</div>';
    return;
  }

  list.forEach(function(g) {
    var card = document.createElement('div');
    card.className = 'group-card';
    var mainCat = (g.cat || 'General').split('/')[0];
    var img = g.image || DEFAULT_WA_IMG;
    var cleanTitle = sanitize(g.title || 'WhatsApp Group');
    var badgeHtml = getStatusBadge();

    card.innerHTML = 
      '<div class="card-top">' +
        '<img src="' + img + '" class="group-avatar-img" onerror="this.src=\'' + DEFAULT_WA_IMG + '\'">' +
        '<div style="flex:1;">' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">' +
            '<div class="card-title">' + cleanTitle + '</div>' +
            badgeHtml +
          '</div>' +
          '<div class="card-meta-line"><span>📚 ' + sanitize(g.cat || 'General') + '</span> • <span>🌍 ' + sanitize(g.country || 'India') + '</span> • <span>🗣️ ' + sanitize(g.lang || 'English') + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="card-desc">' + sanitize(g.desc || 'Active WhatsApp Group.') + '</div>' +
      '<span class="tag-pill">' + sanitize(mainCat) + '</span>' +
      '<div class="card-bottom-actions">' +
        '<a class="btn-join-text" onclick="startJoinFlow(\'' + encodeURI(g.link || '') + '\', \'' + (g._key || '') + '\')">Join group</a>' +
        '<div class="action-right-btns">' +
          '<button class="report-btn" onclick="openReportModal(\'' + cleanTitle + '\')">🚩 Report</button>' +
          '<button class="share-btn-wa" onclick="shareGroup(\'' + encodeURIComponent(cleanTitle) + '\')">Share</button>' +
        '</div>' +
      '</div>';
    container.appendChild(card);
  });
}

function startJoinFlow(link, groupKey) {
  selectedGroupLink = link;

  if (groupKey) {
    var clickUrl = "https://pinksphere-hub-default-rtdb.firebaseio.com/groups/" + groupKey + "/clicks.json";
    fetch(clickUrl)
      .then(function(res){ return res.json(); })
      .then(function(currentClicks){
        var nextClicks = (Number(currentClicks) || 0) + 1;
        fetch(clickUrl, {
          method: 'PUT',
          body: JSON.stringify(nextClicks)
        });
      }).catch(function(){});
  }

  document.getElementById('homeView').style.display = 'none';
  document.getElementById('step1View').style.display = 'block';
  window.scrollTo(0, 0);
}

function goToStep2() {
  document.getElementById('step1View').style.display = 'none';
  document.getElementById('step2View').style.display = 'block';
  window.scrollTo(0, 0);
}

function finalWhatsAppRedirect() {
  if (typeof ADSTERRA_DIRECT_LINK !== 'undefined' && ADSTERRA_DIRECT_LINK) {
    window.open(ADSTERRA_DIRECT_LINK, '_blank');
  }
  setTimeout(function() {
    window.location.href = selectedGroupLink || 'https://chat.whatsapp.com/';
  }, 300);
}

function goHome() {
  document.getElementById('step1View').style.display = 'none';
  document.getElementById('step2View').style.display = 'none';
  document.getElementById('homeView').style.display = 'block';
  window.scrollTo(0, 0);
}

function openReportModal(title) {
  reportingGroupTitle = title;
  document.getElementById('reportModal').style.display = 'flex';
}

function closeReportModal() {
  document.getElementById('reportModal').style.display = 'none';
}

function submitReport() {
  var reason = document.getElementById('reportReason').value;
  var reportData = { groupTitle: reportingGroupTitle, reason: reason, date: new Date().toISOString() };

  fetch(FIREBASE_REPORTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  }).finally(function() {
    closeReportModal();
    alert('Thank you! Your report has been submitted.');
  });
}

function shareGroup(title) {
  window.open('https://api.whatsapp.com/send?text=Join%20' + title + '%20on%20PinkAdda:%20' + encodeURIComponent(window.location.href));
}

function filterGroups() {
  var q = (document.getElementById('searchInput').value || '').toLowerCase();
  var cat = document.getElementById('filterCategory').value;
  var country = document.getElementById('filterCountry').value;
  var lang = document.getElementById('filterLanguage').value;

  var filtered = groupsData.filter(function(g) {
    var matchQ = (g.title + ' ' + (g.desc || '') + ' ' + (g.cat || '')).toLowerCase().indexOf(q) !== -1;
    var matchCat = (cat === 'All' || g.cat === cat);
    var matchCountry = (country === 'All' || g.country === country);
    var matchLang = (lang === 'All' || g.lang === lang);
    return matchQ && matchCat && matchCountry && matchLang;
  });

  renderList(filtered);
}

function openAddModal() {
  document.getElementById('inLink').value = '';
  document.getElementById('inDesc').value = '';
  document.getElementById('addModalOverlay').style.display = 'flex';
}

function closeAddModal() {
  document.getElementById('addModalOverlay').style.display = 'none';
}

async function submitGroup() {
  var link = document.getElementById('inLink').value.trim();
  var desc = document.getElementById('inDesc').value.trim();
  var cat = document.getElementById('inCat').value;
  var country = document.getElementById('inCountry').value;
  var lang = document.getElementById('inLang').value;
  var submitBtn = document.getElementById('btnSubmit');

  if (!link.includes("chat.whatsapp.com/")) {
    alert('Only official WhatsApp group links are accepted!');
    return;
  }

  submitBtn.innerText = 'Adding...';
  submitBtn.disabled = true;

  var autoTitle = (cat.split('/')[0] + " Group");
  var autoDP = DEFAULT_WA_IMG;

  try {
    var res = await fetch('https://api.microlink.io?url=' + encodeURIComponent(link));
    var json = await res.json();
    if (json.status === "success" && json.data) {
      if (json.data.title) autoTitle = json.data.title.replace("WhatsApp Group Invite", "").trim();
      if (json.data.image && json.data.image.url) autoDP = json.data.image.url;
    }
  } catch(err) {}

  var newGroup = {
    title: autoTitle,
    image: autoDP,
    desc: desc || "Active WhatsApp Group.",
    cat: cat,
    country: country,
    lang: lang,
    link: link,
    clicks: 0,
    timestamp: Date.now()
  };

  fetch(FIREBASE_DB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGroup)
  }).then(function(){
    groupsData.unshift(newGroup);
    filterGroups();
    closeAddModal();
    alert('Group added successfully!');
  }).finally(function(){
    submitBtn.innerText = 'Submit';
    submitBtn.disabled = false;
  });
}

function loadFirebase() {
  fetch(FIREBASE_DB_URL)
    .then(function(res){ return res.json(); })
    .then(function(data){
      if (data) {
        var fbList = [];
        Object.keys(data).forEach(function(key) {
          var item = data[key];
          item._key = key;
          fbList.push(item);
        });
        groupsData = groupsData.concat(fbList.reverse());
      }
      filterGroups();
    })
    .catch(function(){ filterGroups(); });
}

document.addEventListener('DOMContentLoaded', function() {
  initDropdowns();
  loadFirebase();
});
      
