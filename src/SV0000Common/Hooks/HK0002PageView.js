export const pageView = (
    title,
    path
) => {
    window.gtag('config', 'G-SH76NQ1HFZ', {
      page_title: title,
      page_path: path,
    });
}

export default pageView