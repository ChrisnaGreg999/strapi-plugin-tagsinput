export const getCurrentTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    const strapiTheme = localStorage.getItem("STRAPI_THEME");

    return (!strapiTheme || strapiTheme === 'system') ? systemTheme : strapiTheme;
};