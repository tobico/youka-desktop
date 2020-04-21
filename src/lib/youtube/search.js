const utils = require("./utils");

module.exports = async function (query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query
  )}&sp=EgIQAQ%253D%253D`;
  const obj = await utils.initialData(url);
  if (!obj) return [];
  const results = [];
  obj.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents.map(
    (i) => {
      const item = i.videoRenderer;
      if (!item) return null;
      const id = item.videoId;
      const title = item.title.runs[0].text;
      const image = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      let hours, minutes, seconds;
      if (item.lengthText) {
        const durationParts = item.lengthText.simpleText.split(":");
        if (durationParts.length === 3) {
          hours = parseInt(durationParts[0]);
          minutes = parseInt(durationParts[1]);
          seconds = parseInt(durationParts[2]);
        } else if (durationParts.length === 2) {
          minutes = parseInt(durationParts[0]);
          seconds = parseInt(durationParts[1]);
        } else {
          seconds = parseInt(durationParts[0]);
        }
      }
      results.push({
        id,
        title,
        image,
        hours,
        minutes,
        seconds,
      });
      return null;
    }
  );
  return results;
};