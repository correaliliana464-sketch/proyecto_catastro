/* ============================================================
   Herramientas IGAC — Portal cartográfico
   Datos y lógica (búsqueda, render, tema).

   ¿Cómo agregar una herramienta?  Añade un objeto al array TOOLS:
     { nombre:"...", cat:"...", icon:"login", desc:"...", url:"..." }
   - "cat" debe coincidir con una de las categorías de ORDER.
   - "icon" es una de las claves de ICONS (login, map, pin, report,
     data, support, payment, quality, doc). Si no existe, usa "doc".
   ============================================================ */

/* ---------- Iconos SVG reutilizables ---------- */
const ICONS = {
  login:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.3"/></svg>',
  map:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  pin:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  report:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  data:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
  support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M20 19a4 4 0 0 1-4 4h-2"/></svg>',
  payment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>',
  quality: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.9 6.8 19.6l1-5.9L3.5 9.5l5.9-.9L12 3z"/></svg>',
  doc:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>'
};

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';

/* ---------- Datos de las herramientas ---------- */
const TOOLS = [
  // Catastro y Registro
  { nombre:"VUR", cat:"Catastro y Registro", icon:"payment",
    desc:"Ventanilla Única de Registro. Consulta del estado de trámites.",
    url:"https://www.vur.gov.co/siteminderagent/forms_es-ES/loginsnr.fcc?TYPE=100663297&REALMOID=06-6c1363d6-46ce-4693-bea4-501339aa6485&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-fqc7JfbsitKYA98880nx7GzOWf3PHSx%2frBwpwn0hvw7giR0TRx5Ii32r0m4mIlPP&TARGET=-SM-HTTP%3a%2f%2fwww%2evur%2egov%2eco%2fportal%2fpages%2fvur%2finicio%2ejsf%3furl%3d-%2Fportal-%2FPantallasVUR-%2F-%23-%2FestadoTramite" },
  { nombre:"SNC", cat:"Catastro y Registro", icon:"login",
    desc:"Sistema Nacional Catastral. Acceso al núcleo de gestión catastral.",
    url:"https://snc.igac.gov.co/snc/login.jsf" },
  { nombre:"CICA", cat:"Catastro y Registro", icon:"data",
    desc:"Interfaz de captura e ingesta de la información catastral (CICA).",
    url:"https://ui-snc-cica.igac.gov.co/" },
  { nombre:"Interrelación", cat:"Catastro y Registro", icon:"login",
    desc:"Interrelación Catastro–Registro. Consulta y cruce de información.",
    url:"https://sso-prd.igac.gov.co/realms/IGAC/protocol/openid-connect/auth?client_id=interrelacion-cr-ui&redirect_uri=https%3A%2F%2Fcatastro-registro.igac.gov.co%2Finicio&state=8fbda9ae-b3ff-497e-8775-9be746b0ecb7&response_mode=fragment&response_type=code&scope=openid&nonce=20ee7d93-3578-4cd7-b11b-3f277863eab7&code_challenge=WiEd31izqCX6tXpRDohG3rx--04zzLnjVqDadCPXVck&code_challenge_method=S256" },
  { nombre:"Reportes SNC", cat:"Catastro y Registro", icon:"report",
    desc:"Tablero de reportes y consultas operativas del SNC (APEX).",
    url:"http://172.19.0.104:8080/ords/apexdev/r/reportes-snc103/login?session=10577113883569" },
  { nombre:"SIGAC", cat:"Catastro y Registro", icon:"login",
    desc:"Sistema de Información Geográfica de Apoyo al Catastro.",
    url:"https://sigac.igac.gov.co/forestWorkplace/#/login" },
  { nombre:"Listado Maestro", cat:"Catastro y Registro", icon:"doc",
    desc:"Listado maestro de documentos · Transparencia y acceso a la información.",
    url:"https://www.igac.gov.co/transparencia-y-acceso-a-la-informacion-publica/informacion-de-la-entidad/listado-maestro-de-documentos" },
  { nombre:"IGACNET", cat:"Catastro y Registro", icon:"login",
    desc:"Intranet institucional del IGAC.",
    url:"https://igacnet.igac.gov.co/front" },
  { nombre:"KLIC", cat:"Catastro y Registro", icon:"login",
    desc:"Plataforma KLIC del IGAC.",
    url:"https://klic.igac.gov.co/#/login" },
  { nombre:"GLPI · Mesa de Servicio", cat:"Catastro y Registro", icon:"support",
    desc:"Mesa de servicio y gestión de tickets de soporte.",
    url:"https://mesadeservicio.igac.gov.co/" },

  // Consulta y Geográfico
  { nombre:"SIGI", cat:"Consulta y Geográfico", icon:"map",
    desc:"Portal SIGI · Direcciones Territoriales y aplicaciones geográficas.",
    url:"https://sigi.igac.gov.co/portal/apps/sites/#/sigi/pages/direcciones-territoriales" },
  { nombre:"SIGI (Portal)", cat:"Consulta y Geográfico", icon:"map",
    desc:"Inicio del portal SIGI con el catálogo completo de contenidos.",
    url:"https://sigi.igac.gov.co/portal/home/index.html" },
  { nombre:"Visor Art. 49", cat:"Consulta y Geográfico", icon:"pin",
    desc:"Visor web geográfico del Artículo 49.",
    url:"https://sigi.igac.gov.co/portal/apps/webappviewer/index.html?id=416048809f8548d29f309e87d342f12c" },

  // Gestión y Datos
  { nombre:"SEGA PRO", cat:"Gestión y Datos", icon:"login",
    desc:"Acceso a la plataforma SEGA PRO del IGAC.",
    url:"https://segapro.igac.gov.co/login" },
  { nombre:"Herramientas de Calidad", cat:"Gestión y Datos", icon:"quality",
    desc:"Validación de consistencia lógica, ingesta CICA y proyectos de campo.",
    url:"https://igacoffice365.sharepoint.com/sites/HerramientasdeCalidad/SitePages/HomeForBrandCentral.aspx?e=4%3A4834fd30a4fb429c99578be66a26113d&web=1&sharingv2=true&fromShare=true&at=9&xsdata=MDV8MDJ8bGlsaWFuYS5jb3JyZWFAaWdhYy5nb3YuY298MTU0OTAyMWFiM2UwNGQ3ZTQxOGIwOGRkZmY1YWJlMWZ8ZWQ0OWZlOWE2ZWVhNDdlNmJmNTJlZTllY2I1ZGE4MDd8MHwwfDYzODk0NzQ4NzM5MTYyNzc0NnxVbmtub3dufFRXRnBiR1pzYjNkOGV5SkZiWEIwZVUxaGNHa2lPblJ5ZFdVc0lsWWlPaUl3TGpBdU1EQXdNQ0lzSWxBaU9pSlhhVzR6TWlJc0lrRk9Jam9pVFdGcGJDSXNJbGRVSWpveWZRPT18MHx8fA%3D%3D&sdata=MFdycndoalk2NW5ERTN1ZHdNY25MMDV6SVBrRUR4R083OHdyeHNWUGJGaz0%3D&CT=1772038362487&OR=OWA-NT-Mail&CID=2fac590f-a948-01a3-54e7-529f4829beae" },
  { nombre:"Power BI ColSmart", cat:"Gestión y Datos", icon:"report",
    desc:"Tablero analítico ColSmart en Power BI.",
    url:"https://app.powerbi.com/view?r=eyJrIjoiMmUxMmQ5ZGYtNTk0Yi00NjhjLWE5YWItZjI2NWIxOWI1NDg4IiwidCI6ImVkNDlmZTlhLTZlZWEtNDdlNi1iZjUyLWVlOWVjYjVkYTgwNyJ9&pageName=fa4fd4e19a712a1c7d78" },

  // Trámites y Pagos
  { nombre:"Reintegros / Comisiones", cat:"Trámites y Pagos", icon:"payment",
    desc:"Pago en línea (PSE) de reintegros y comisiones.",
    url:"https://www.psepagos.co/psehostingui/ShowTicketOffice.aspx?ID=8447" }
];

/* Orden en que se muestran las categorías */
const ORDER = ["Catastro y Registro","Consulta y Geográfico","Gestión y Datos","Trámites y Pagos"];

/* Código cartográfico corto por categoría (detalle mono en la tarjeta) */
const CAT_CODE = {
  "Catastro y Registro": "CR",
  "Consulta y Geográfico": "GEO",
  "Gestión y Datos": "DAT",
  "Trámites y Pagos": "PAG"
};
function pad2(n){ return String(n).padStart(2,"0"); }

/* ---------- Render ---------- */
const content = document.getElementById('content');
const emptyEl = document.getElementById('empty');

function cardHTML(t, idx){
  const code = (CAT_CODE[t.cat] || "IG") + "·" + pad2(idx + 1);
  return `<a class="card" href="${t.url}" target="_blank" rel="noopener noreferrer"
            data-search="${(t.nombre+' '+t.desc+' '+t.cat).toLowerCase()}">
    <div class="card-top">
      <span class="icon">${ICONS[t.icon]||ICONS.doc}</span>
      <span class="card-title">
        <h4>${t.nombre}</h4>
        <span class="code">${code}</span>
      </span>
    </div>
    <p class="desc">${t.desc}</p>
    <span class="go">Abrir ${arrow}</span>
  </a>`;
}

function render(){
  const groups = ORDER.filter(c => TOOLS.some(t => t.cat === c));
  content.innerHTML = groups.map(cat => {
    const items = TOOLS.filter(t => t.cat === cat);
    return `<section class="cat" data-cat="${cat}">
      <div class="cat-head">
        <h3>${cat}</h3>
        <span class="line"></span>
        <span class="count">[${pad2(items.length)}]</span>
      </div>
      <div class="grid">${items.map(cardHTML).join('')}</div>
    </section>`;
  }).join('');
}

/* ---------- Búsqueda ---------- */
function filter(q){
  q = q.trim().toLowerCase();
  let visibleTotal = 0;
  document.querySelectorAll('.cat').forEach(sec => {
    let shown = 0;
    sec.querySelectorAll('.card').forEach(card => {
      const match = !q || card.dataset.search.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    sec.querySelector('.count').textContent = '[' + pad2(shown) + ']';
    sec.style.display = shown ? '' : 'none';
    visibleTotal += shown;
  });
  emptyEl.style.display = visibleTotal ? 'none' : 'block';
}

/* ---------- Tema ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById('theme');
function applyTheme(mode){
  root.setAttribute('data-theme', mode);
  document.body.classList.toggle('dark', mode === 'dark');
}
(function initTheme(){
  const saved = localStorage.getItem('igac-theme');
  if (saved) applyTheme(saved);
  else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();
themeBtn.addEventListener('click', () => {
  const dark = root.getAttribute('data-theme') !== 'dark';
  applyTheme(dark ? 'dark' : 'light');
  localStorage.setItem('igac-theme', dark ? 'dark' : 'light');
});

/* ---------- Init ---------- */
render();
const searchEl = document.getElementById('search');
searchEl.addEventListener('input', e => filter(e.target.value));
/* atajo: al presionar "/" fuera del campo, enfoca el buscador */
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchEl) {
    e.preventDefault(); searchEl.focus();
  }
});
