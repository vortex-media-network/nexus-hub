const rawGroupLinks = [
  { link: "https://chat.whatsapp.com/DKS5S5X0Sy19q0IAVcxkBZ?s=cl&p=a&nlu=4", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/CauEa4KfmPFB1lioEt2dBF?s=cl&p=a&nlu=4", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/ENmCjtoWmssKJEwq9rjPGb?s=cl&p=a&nlu=4", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/Bhfq7PdToX5IHa1KjoVqsd?s=cl&p=a&nlu=4", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/LauIaRlXCT24I2arL0Q0eo?s=cl&p=a&nlu=4", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" },
  { link: "https://chat.whatsapp.com/LegsrYsosn94ZKEj42dWAJ?s=cl&p=a&nlu=4", cat: "Adult/18+/Hot", country: "India", lang: "Tamil" }
];

// ਆਟੋਮੈਟਿਕ ਅਸਲੀ DP ਅਤੇ ਨਾਮ ਲਿਆਉਣ ਵਾਲਾ ਸਿਸਟਮ
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

loadAutoGroups();
