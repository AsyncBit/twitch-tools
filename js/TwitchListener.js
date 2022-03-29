let channel = "";
let token = "";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has("token")) {
  token = urlParams.get("token");
} else {
  token = "";
}

if (urlParams.has("channel")) {
  channel = urlParams.get("channel");
} else {
  channel = "";
}

if (token) {
  ComfyJS.Init(channel, token);
  console.log("Channel Send");
} else {
  ComfyJS.Init(channel);
  console.log("No Send");
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
  // flags.broadcaster -> boolean
  // flags.mod -> boolean
  // flags.vip -> boolean
  // command -> string
  if (
    (flags.broadcaster && command === "so") ||
    (flags.mod && command === "so")
  ) {
    if (message.length > 0) {
      const username = message.split(" ")[0].split("@");
      const withOutAt = username[username.length - 1];
      soQueue.push(withOutAt);
      playSo();
    }
  }
};

ComfyJS.onChat = (user, message, flags, self, extra) => {
  // Disabled
  return;
  if (!isSolved) {
    message = message.replace("?", "");
    message = message.replace("@", "");
    message = message.split(" ");

    if (per === "All") {
      guess(message[0].toLowerCase(), user);
    } else if (per === "Subs") {
      if (flags.subscriber || flags.mod || flags.broadcaster) {
        guess(message[0].toLowerCase(), user);
      }
    } else if (per === "Vips" || flags.mod || flags.broadcaster) {
      if (flags.vip) {
        guess(message[0].toLowerCase(), user);
      }
    } else if (per === "Vip/Subs") {
      if (flags.vip || flags.subscriber || flags.mod || flags.broadcaster) {
        guess(message[0].toLowerCase(), user);
      }
    }
  }
};
