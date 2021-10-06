export default ({ store }) => {
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "a55ad37e-a5e5-4f53-85d8-f01295f731ac";

  if (typeof store.state.users.loggedUser !== 'undefined') {
    const user = store.state.users.loggedUser
    window.$crisp.push(["set", "user:nickname", [`${user.sub}:${user.full_name}`]]);
  }

  (function() {
    var d = document;
    var s = d.createElement("script");

    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
};