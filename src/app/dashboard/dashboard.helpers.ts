export const getLeague = (xpPoints: number) => {
  if (xpPoints >= 0 && xpPoints <= 200) {
    return {
      name: "Byte",
      start: 0,
      end: 200,
      barColor: "#40C776",
      bgColor: "#0F3634",
      cardShadowColor: "#008A61",
      barShadowColor:"#0F825E",
      barGlowColor:"#0F825E",
      barBg:"#0C3836",
      icon: "/byte/icon.png",
      human: "/byte/human.png",
    };
  } else if (xpPoints > 200 && xpPoints <= 500) {
    return {
      name: "Kilobyte",
      start: 200,
      end: 500,
      barColor: "#FF9000",
      bgColor: "#5A1C11",
      cardShadowColor: "#9B3E00",
      barShadowColor:"#0965B1",
      barGlowColor:"#D98600",
      barBg:"#280000",
      icon: "/kilobyte/icon.png",
      human: "/kilobyte/human.png",
    };
  } else if (xpPoints > 500 && xpPoints <= 1000) {
    return {
      name: "Megabyte",
      start: 500,
      end: 1000,
      barColor: "#22D6E7",
      bgColor: "#0C182F",
      cardShadowColor: "#093594",
      barShadowColor:"#0965B1",
      barGlowColor:"#2F8AD4",
      barBg:"#0C3836",
      icon: "/megabyte/icon.png",
      human: "/megabyte/human.png",
    };
  } else if (xpPoints > 1000 && xpPoints <= 2000) {
    return {
      name: "Gigabyte",
      start: 1000,
      end: 2000,
      barColor: "#DB07C6",
      bgColor: "#1E0F33",
      cardShadowColor: "#720486",
      barShadowColor:"#0965B1",
      barGlowColor:"#AE2FD4",
      barBg:"#32027B",
      icon: "/gigabyte/icon.png",
      human: "/gigabyte/human.png",
    };
  } else if (xpPoints > 2000 && xpPoints <= 5000) {
    return {
      name: "Terabyte",
      start: 2000,
      end: 5000,
      barColor: "#00FF6E",
      bgColor: "#0F7B29",
      cardShadowColor: "#9B3E00",
      barShadowColor:"#00FF80",
      barGlowColor:"#7BFF00",
      barBg:"#125503",
      icon: "/terabyte/icon.png",
      human: "/terabyte/human.png",
    };
  } else {
    return null;
  }
};
