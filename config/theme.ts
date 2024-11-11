const theme = {
  "colors": {
    "default": {
      "text_color": {
        "default": "#404040", //text-neutral-700
        "dark": "#171717", //text-neutral-900
        "light": "#737373",  //text-neutral-500
        "alarm": "#b91c1c", //text-red-700
        "success": "#047857", //text-emerald-700
        "info": "#2b6cb0", //text-blue-700
        "warning": "#d97706", //text-amber-700
      },
      "theme_color": {
        "body": "#fafafa", //bg-neutral-50
        "primary": "#fff", //bg-white 
        "border": "#eaeaea",
        "theme_light": "#f6f6f6",
        "secondary": "#fdba74", //bg-orange-300
        "secondary-accent": "#fb923c", //bg-orange-400
        "form": "#f5f5f5", //bg-neutral-100
      },
      input: {
        bg: "#fff", //bg-white
        border: "#d4d4d4", //border-neutral-300
      },
      checkbox: {
        border: "#d4d4d4", //border-neutral-300
      },
      dropdown: {
        bg: "white", //bg-white
        highlight: "#fdba74", //bg-orange-300
        text: "#404040", //text-neutral-700
        border: "#d4d4d4", //border-neutral-300
        scroll: "#d4d4d4 #f5f5f5", //bg-neutral-300 bg-neutral-100
        shadow: '0px 9px 10px 0px rgba(66, 68, 90, 0.21)'
      },
      "navigation": {
        "bg": "#fafafa" //bg-neutral-50
      },
      modal: {
        shadow: '0 0 17px 2px rgb(225 225 225)',
        background: '#fafafa', //bg-white
        separator: "#d4d4d4" //border-neutral-300
      },
      drawer: {
        background: "#f5f5f5", //bg-neutral-100
        icon: "#525252", //text-neutral-600
        'icon-selected': '#27272a' //text-neutral-800
      }
    },
    "darkmode": {
      "text_color": {
        "default": "#e5e5e5", //text-neutral-200
        "dark": "#a3a3a3", //text-neutral-400
        "light": "#f5f5f5", //text-neutral-100
        "alarm": "#f87171", //text-red-400
        "success": "#34d399", //text-emerald-400
        "info": "#2563eb", //text-blue-500
        "warning": "#f59e0b" //text-amber-500
      },
      "theme_color": {
        "body": "#171717", //bg-neutral-900
        "primary": "#0a0a0a", //bg-neutral-950
        "border": "#3E3E3E",
        "theme_light": "#222222",
        "secondary": "#d97706", //bg-amber-600
        "secondary-accent": "#b45309", //bg-amber-700
        "form": "#262626", //bg-neutral-800
        "input": "#404040" //bg-neutral-700
      },
      input: {
        bg: "#404040", //bg-neutral-700
        border: "#525252", //border-neutral-600
      },
      checkbox: {
        border: "#525252", //border-neutral-600
      },
      dropdown: {
        highlight: "#b45309", //bg-amber-700
        text: "#e5e5e5", //text-neutral-200
        bg: "#404040", //bg-neutral-700
        border: "#525252", //border-neutral-600
        scroll: "#525252 rgba(38, 38, 38, 0.4)", //bg-neutral-600 bg-neutral-800/40
        shadow: '9px 10px 10px -7px rgba(0, 0, 0, 1)'
      },
      "navigation": {
        "bg": "#262626", //bg-neutral-800
      },
      modal: {
        shadow: '0 0 17px 2px rgb(30 30 30)',
        background: '#262626', //bg-neutral-800
        separator: "#525252" //border-neutral-600
      },
      drawer: {
        background: "#1a1a1a",
        icon: "#d4d4d4", //text-neutral-300
        'icon-selected': '#f5f5f5' //text-neutral-100
      },
      table: {
        "darker": "#202020",
        "lighter": "#303030",
      }
    }
  },
  "fonts": {
    "font_family": {
      "primary": "Open+Sans:wght@400;600",
      "primary_type": "sans-serif",
      "secondary": "Open+Sans:wght@500;700",
      "secondary_type": "sans-serif",
      "code": "Fira+Code:wght@400;600"
    },
    "font_size": {
      "base": "16",
      "scale": "1.250"
    }
  }
}

export default theme;