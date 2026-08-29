const rawGroupLinks = [
  { link: "https://chat.whatsapp.com/BVJwSvpreoyHY1oMTBx8Bt", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/J8Up1ZvNj6QLdkCLxTnfDU", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/Jt1yogOBevFD4r49cxhX1k", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/HKrKQD04IzoLXi5frokzcb", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/Bauu0OOHFL4IL2h1FAxZu5", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/I8mnDdX9Nhx8v7iUFdoaqG", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/Fg1BUTN0vkSGncqebvnbzQ", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" }
];

async function loadAutoGroups() {
  const DEFAULT_IMG = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

  for (let item of rawGroupLinks) {
    let autoTitle = "WhatsApp Group";
    let autoDP = DEFAULT_IMG;

    try {
      let res = await fetch('https://api.microlink.io?url=' + encodeURIComponent(item.link));
      let json = await res.json();
      if (json.status === "success" && json.data) {
        if (json.data.title) autoTitle = json.data.title.replace("WhatsApp Group Invite", "").trim();
        if (json.data.image && json.data.image.url) autoDP = json.data.image.url;
      }
    } catch(e) {}

    const formattedGroup = {
      title: autoTitle,
      image: autoDP,
      desc: "Active WhatsApp group for daily updates.",
      cat: item.cat,
      country: item.country,
      lang: item.lang,
      link: item.link
    };

    if (typeof groupsData !== 'undefined') {
      groupsData.unshift(formattedGroup);
      if (typeof filterGroups === 'function') filterGroups();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadAutoGroups();
});
