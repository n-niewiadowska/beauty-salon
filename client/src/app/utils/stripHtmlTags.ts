const stripHtmlTags = (str: string) => {
  if (str === null) {
    return false;
  } else {
    str = str.toString();
    return str.replace(/<[^>]*>/g, "");
  }
}

export default stripHtmlTags;