/**
 * HTML Elements
 * video player: document.getElementById("video")
 * video holder: document.getElementById("video-holder")
 * video source: document.getElementById("source")
 * audio source: document.getElementById("audio")
 */
let running = false;

let CLIENT_ID = "";
let CLIENT_SECRET = "";

if (urlParams.has("clientid")) {
  CLIENT_ID = urlParams.get("clientid");
} else {
  CLIENT_ID = "";
}

if (urlParams.has("clientsecret")) {
  CLIENT_SECRET = urlParams.get("clientsecret");
} else {
  CLIENT_SECRET = "";
}

let soQueue = [];

async function playSo() {
  if (!running && soQueue.length > 0) {
    running = true;
  } else {
    return;
  }
  const username = soQueue[0];
  soQueue.shift();
  const accessToken = await getTwitchCredentials().then((res) => {
    let options = {};
    options.headers = {};
    options.headers["Client-ID"] = CLIENT_ID;
    options.headers["Authorization"] = `Bearer ${res.access_token}`;

    getBroadcasterId(username, options).then((broadcasterId) => {
      fetch(
        `https://api.twitch.tv/helix/clips?first=100&broadcaster_id=${broadcasterId}`,
        options
      ).then((clipRes) => {
        clipRes.json().then((x) => {
          const data = x.data;
          const clipToPlay = data[Math.floor(Math.random() * data.length)];
          const clipUrl = getClipStreamURL(clipToPlay);
          document.getElementById("video").load();
          document.getElementById("video").loop = false;
          document.getElementById("video").controls = false;
          document.getElementById("video").volume = 50 / 100;
          document.getElementById("video").src = clipUrl;

          document.getElementById("audio").src = clipUrl;

          document.getElementById("video-holder").style.visibility = "visible";
          document.getElementById("video").play();
          document.getElementById("audio").play();
        });
      });
    });
  });
}

function stopVid() {
  document.getElementById("video").pause();
  document.getElementById("video-holder").style.visibility = "hidden";
  running = false;
  playSo();
}

function getClipStreamURL(clip) {
  console.log(clip);
  let thumbPart = clip.thumbnail_url.split("-preview-");
  return thumbPart[0] + ".mp4";
}

let OAUTH = null;
async function getTwitchCredentials() {
  if (OAUTH) return OAUTH;

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );
  OAUTH = await response.json();
  //console.log(OAUTH);
  return OAUTH;
}

async function getBroadcasterId(BROADCASTER_NAME, options) {
  const response = await fetch(
    `https://api.twitch.tv/helix/users?login=${BROADCASTER_NAME}`,
    options
  );
  BROADCASTER_ID = (await response.json()).data[0].id;
  return BROADCASTER_ID;
}
