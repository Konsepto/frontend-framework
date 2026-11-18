# Component documentation data: (id, title, files, description html, classes [(class, meaning)],
# settings [custom properties], demo html or None, extra code (e.g. JS) or None)

IMG = ("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E"
       "%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23DDDDDD'/%3E"
       "%3Cstop offset='1' stop-color='%23999999'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E"
       "%3Ccircle cx='470' cy='120' r='48' fill='%23EEEEEE'/%3E%3Cpath d='M0 360 L210 170 L330 280 L420 210 L640 360Z' fill='%23666666'/%3E%3C/svg%3E")

COMPONENTS = [
 dict(id='c-typografia', title='Typografia ja tekstit', group='Perusta',
  files=['core/css/elements.css', 'theme-default/css/elements.css', 'core/css/text.css', 'theme-default/css/text.css'],
  desc='<p>HTML-elementtien perustyylit: otsikot, kappaleet, listat, lainaukset ja koodi. Pienillä näytöillä (<code>--small</code>) tekstikoko ja välit pienenevät automaattisesti. <code>.lead</code> on ingressi, <code>.caption</code> pienempi selite ja <code>.dim</code> himmennetty teksti.</p>',
  classes=[('h1–h6, .h1–.h6', 'Otsikot; luokalla saa otsikon tyylin muuhun elementtiin'), ('.lead', 'Ingressi'), ('.caption', 'Kuvateksti tai pieni selite'), ('.dim', 'Himmennetty teksti')],
  settings=['--ff-body-font-size', '--ff-body-line-height', '--ff-paragraph-margin', '--ff-heading-1-font-size … -6-', '--ff-lead-font-size', '--ff-caption-font-size', '--ff-font-body', '--ff-font-heading', '--ff-small-screen-body-font-size'],
  demo='''<h1>Palvelut yrityksille</h1>
<p class="lead">Suunnittelemme ja toteutamme verkkosivustoja, jotka toimivat kaikilla laitteilla.</p>
<h2>Miten työskentelemme</h2>
<p>Aloitamme tarpeiden kartoituksella. Sen jälkeen teemme <a href="#">sivukartan</a> ja ensimmäiset luonnokset Figmassa.</p>
<ul><li>Kartoitus ja tavoitteet</li><li>Suunnittelu ja prototyyppi</li><li>Toteutus ja julkaisu</li></ul>
<h3>Hinnoittelu</h3>
<p class="caption">Hinnat sisältävät arvonlisäveron.</p>
<blockquote><p>Uusi sivusto latautuu puolet nopeammin kuin vanha.</p></blockquote>'''),

 dict(id='c-ruudukko', title='Ruudukko (flex-grid)', group='Perusta',
  files=['core/css/grid.css'],
  desc='<p>Flexbox-pohjaiset asetteluluokat. <code>.flex-grid-N</code> jakaa lapsielementit N:ään yhtä leveään sarakkeeseen gutterin (<code>--ff-gutter-width</code>) välein. Pienillä näytöillä sarakkeet pinoutuvat. <code>.flex</code> ja tasausluokat (<code>.flex-middle</code>, <code>.flex-center</code>, <code>.flex-right</code>…) asettavat elementit riviin.</p>',
  classes=[('.flex-grid-1 … .flex-grid-12', 'Sarakkeiden määrä'), ('.flex, .flex-row, .flex-col', 'Rivi tai sarake ilman kiinteää jakoa'), ('.flex-left, .flex-center, .flex-right', 'Vaakatasaus'), ('.flex-top, .flex-middle', 'Pystytasaus'), ('.flex-multirow', 'Rivit saavat rivittyä')],
  settings=['--ff-gutter-width', '--ff-gutter-height'],
  demo='''<div class="flex-grid flex-grid-3">
  <div class="panel">Palvelu A</div>
  <div class="panel">Palvelu B</div>
  <div class="panel">Palvelu C</div>
</div>
<div class="flex flex-middle" style="margin-top:24px">
  <a class="button" href="#">Ota yhteyttä</a>
  <span style="margin-left:16px">Vastaamme arkipäivisin.</span>
</div>'''),

 dict(id='c-painikkeet', title='Painikkeet', group='Komponentit',
  files=['core/css/button.css', 'theme-default/css/button.css'],
  desc='<p>Painikeluokka toimii linkeille (<code>a</code>), <code>button</code>-elementeille ja lomakkeen painikkeille. Tilat: hover, <code>.active</code> (tai <code>:active</code>) ja <code>.disabled</code> (tai <code>:disabled</code>). <code>.button-group</code> asettaa painikkeet riviin.</p><p>Protosite-childissa painikkeen pyöristys tulee Figman <code>radius/md</code>-tokenista.</p>',
  classes=[('.button', 'Painike'), ('.button-icon, .button-icon-text', 'Painike, jossa ikoni (ja teksti)'), ('.active', 'Painettu tai valittu tila'), ('.disabled', 'Ei käytettävissä'), ('.button-group', 'Painikkeet rivissä')],
  settings=['--ff-color-button-bg-default', '--ff-color-button-bg-hover', '--ff-color-button-bg-active', '--ff-color-button-bg-disabled', '--ff-color-text-inverse', '--ff-color-border-subtle', '--ff-button-padding'],
  demo='''<div class="button-group">
  <a class="button" href="#">Lue lisää</a>
  <button class="button" type="button">Lähetä</button>
  <a class="button active" href="#">Valittu</a>
  <button class="button" type="button" disabled>Ei käytössä</button>
</div>'''),

 dict(id='c-lomakkeet', title='Lomakkeet', group='Komponentit',
  files=['core/css/form.css', 'theme-default/css/form.css', 'core/css/elements.css'],
  desc='<p>Lomake-elementit saavat perustyylit ilman luokkia. <code>.form</code>-kääreen sisällä nimiöt, ohjeet ja painikkeet saavat lisäksi lomakkeen rytmin. Pakollinen kenttä (<code>required</code>) saa oman taustavärin.</p>',
  classes=[('.form', 'Lomakkeen kääre'), ('.form-field', 'Yksi kenttä nimiöineen'), ('.form-label', 'Kentän nimiö'), ('.form-hint, .form-tip', 'Ohjeteksti'), ('.form-actions', 'Lomakkeen painikkeet'), ('.form-honeypot', 'Roskapostiansan piilokenttä')],
  settings=['--ff-color-input-bg-default', '--ff-color-input-bg-required', '--ff-color-input-bg-disabled', '--ff-color-border-default', '--ff-form-label-font-size'],
  demo='''<form class="form" onsubmit="return false">
  <div class="form-field">
    <label class="form-label" for="nimi">Nimi</label>
    <input id="nimi" type="text" required>
  </div>
  <div class="form-field">
    <label class="form-label" for="email">Sähköposti</label>
    <input id="email" type="email" placeholder="nimi@esimerkki.fi">
    <p class="form-hint">Vastaamme tähän osoitteeseen.</p>
  </div>
  <div class="form-field">
    <label class="form-label" for="viesti">Viesti</label>
    <textarea id="viesti"></textarea>
  </div>
  <div class="form-actions"><button class="button" type="submit">Lähetä</button></div>
</form>'''),

 dict(id='c-haku', title='Hakulomake', group='Komponentit',
  files=['core/css/search-form.css', 'theme-default/css/search-form.css'],
  desc='<p>Hakukenttä ja -painike riviin. Protosite-childissa hakulomake on headerissa drawerin sisällä (ks. <a href="#c-drawer">Drawer</a>).</p>',
  classes=[('.search-form', 'Lomakkeen kääre'), ('.search-form-input', 'Hakukenttä'), ('.search-form-button', 'Hakupainike (.active, kun haku on auki)')],
  settings=['--ff-color-input-bg-default', '--ff-color-border-default', '--ff-color-button-bg-default'],
  demo='''<form class="search-form" role="search" onsubmit="return false">
  <label class="screen-reader" for="s">Hae sivustolta</label>
  <input class="search-form-input" id="s" type="search" placeholder="Hae…">
  <button class="search-form-button button" type="submit">Hae</button>
</form>'''),

 dict(id='c-linkit', title='Linkit ja saavutettavat linkit', group='Komponentit',
  files=['core/css/link.css', 'theme-default/css/link.css', 'core/js/modules/accessible-links.js'],
  desc='<p><code>accessibleLinks()</code> (JavaScript) tunnistaa linkin tyypin (tiedosto, sähköposti, puhelin, ulkoinen sivusto, uusi välilehti, ankkuri) ja lisää linkkiin luokan, ikonin sekä ruudunlukijalle sulkeissa olevan selitteen. CSS piirtää ikonit. <code>.link-more</code> ja <code>.link-less</code> ovat "lue lisää" -tyyppisiä linkkejä.</p>',
  classes=[('.link-pdf-file, .link-word-file …', 'Tiedostotyyppi (lisää JS)'), ('.link-email, .link-phone', 'Protokolla (lisää JS)'), ('.link-external, .link-new-tab', 'Ulkoinen sivusto, uusi välilehti (lisää JS)'), ('.link-more, .link-less', 'Lue lisää / vähemmän'), ('.link-unmarked', 'Linkki ilman alleviivausta')],
  settings=['--ff-color-text-link'],
  demo='''<p><a class="accessible-link link-pdf-file" href="#">Vuosiraportti 2025<span class="link-file-type-icon"><span class="assistive text">(PDF-tiedosto)</span></span></a></p>
<p><a class="accessible-link link-word-file" href="#">Tarjouspohja<span class="link-file-type-icon"><span class="assistive text">(Word-tiedosto)</span></span></a></p>
<p><a class="accessible-link link-external" href="#">Saavutettavuusvaatimukset<span class="link-host-icon"><span class="assistive text">(ulkoinen)</span></span></a></p>
<p><a class="link-more" href="#">Lue lisää palveluista</a></p>''',
  code='''// js/main.js (JavaScript-moduuli)
import { accessibleLinks } from '@front-end-framework/accessible-links';
accessibleLinks(document.querySelectorAll('a:not([role="button"])'));'''),

 dict(id='c-viestit', title='Järjestelmäviestit', group='Komponentit',
  files=['core/css/system-message.css', 'theme-default/css/system-message.css'],
  desc='<p>Ilmoituslaatikot lomakkeiden ja toimintojen palautteelle. Jokaisella tyypillä on oma värinsä ja ikoni. Drupalin <code>.messages.status</code> jne. saavat samat tyylit.</p>',
  classes=[('.system-message', 'Yleinen viesti'), ('.system-message-success', 'Onnistui'), ('.system-message-notice', 'Huomautus'), ('.system-message-failure', 'Virhe'), ('.system-message-information', 'Tiedote'), ('.system-message-question', 'Kysymys')],
  settings=['--ff-color-message-default-bg / -text', '--ff-color-message-success-bg / -text', '--ff-color-message-notice-…', '--ff-color-message-failure-…', '--ff-color-message-information-…', '--ff-color-message-question-…'],
  demo='''<div class="system-message-success">Viestisi on lähetetty.</div>
<div class="system-message-notice">Tarkista puhelinnumero ennen lähettämistä.</div>
<div class="system-message-failure">Sähköpostiosoite puuttuu.</div>
<div class="system-message-information">Palvelu on huoltokatkon takia poissa käytöstä su 2–4.</div>
<div class="system-message-question">Haluatko tilata uutiskirjeen?</div>'''),

 dict(id='c-sivutus', title='Sivutus', group='Navigointi',
  files=['core/css/pagination.css', 'theme-default/css/pagination.css'],
  desc='<p>Sivunumerot ja edellinen/seuraava-linkit riveinä, jotka rivittyvät kapealla näytöllä. Nykyinen sivu merkitään <code>aria-current="page"</code>-attribuutilla.</p>',
  classes=[('.pagination', 'Kääre'), ('.pagination-numbers', 'Sivunumerolista'), ('.pagination-controls', 'Edellinen / seuraava'), ('.assistive', 'Ruudunlukijan teksti')],
  settings=['--ff-font-body', '--ff-body-font-size'],
  demo='''<nav class="pagination" aria-label="Sivutus">
  <ul class="pagination-numbers">
    <li><a href="#">1</a></li>
    <li><a href="#" aria-current="page"><strong>2</strong></a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">Seuraava<span class="assistive"> sivu</span> →</a></li>
  </ul>
</nav>'''),

 dict(id='c-murupolku', title='Murupolku', group='Navigointi',
  files=['core/css/breadcrumbs.css', 'theme-default/css/breadcrumbs.css'],
  desc='<p>Polku sivuston rakenteessa. Viimeinen kohta (<code>.active</code>) on nykyinen sivu.</p>',
  classes=[('.breadcrumbs', 'Lista (ol tai ul)'), ('li.active', 'Nykyinen sivu')],
  settings=['--ff-color-text-link', '--ff-gray-…'],
  demo='''<nav aria-label="Murupolku">
  <ol class="breadcrumbs">
    <li><a href="#">Etusivu</a></li>
    <li><a href="#">Palvelut</a></li>
    <li class="active"><a href="#" aria-current="page">Verkkosivut</a></li>
  </ol>
</nav>'''),

 dict(id='c-valikko', title='Navigaatiovalikko', group='Navigointi',
  files=['core/css/navigation-menu.css', 'theme-default/css/navigation-menu.css', 'core/css/navigation-menu-responsive.css', 'theme-default/css/navigation-menu-responsive.css', 'core/js/modules/navigation-menu.js'],
  desc='<p>Pudotusvalikko tavallisesta HTML-listasta. <code>navigationMenu()</code> lisää alavalikoille avausnapit, ARIA-attribuutit ja nykyisen sivun merkinnät. Asettelu valitaan luokalla: vaakapalkki pudotusvalikoilla, pystysarake tai mobiililista.</p><p>Protosite-childin ja GEO-teeman päävalikko käyttää <code>.navigation-menu-responsive</code>-luokkaa (lisätään <code>functions.php</code>:ssä suodattimella <code>widget_nav_menu_args</code>). Figman <em>Site header</em>, <em>Menu item</em> ja <em>Submenu item</em> -komponentit kuvaavat sen ulkoasun.</p>',
  classes=[('.navigation-menu-responsive', 'Mobiililista alle --large, vaakapalkki pudotuksin siitä ylöspäin (navigation-menu-responsive.css; Protosite-sivustojen päävalikko)'), ('.navigation-menu-bar-dropdown', 'Vaakapalkki, alavalikot pudotuksina'), ('.navigation-menu-col-dropdown', 'Pystysarake'), ('.navigation-menu-mobile', 'Mobiililista (koko leveys)'), ('.navigation-menu-megamenu', 'Megavalikko'), ('.has-children, .expanded, .collapsed', 'Tilat (lisää JS)'), ('.current-menu-item, .current-menu-ancestor', 'Nykyinen sivu ja sen vanhemmat')],
  settings=['--ff-color-nav-bg-default', '--ff-color-nav-bg-hover', '--ff-color-nav-bg-active-trail', '--ff-color-text-primary', '--ff-color-text-inverse'],
  demo='''<nav class="navigation-menu-bar-dropdown" aria-label="Päänavigaatio">
  <ul class="navigation-menu">
    <li class="navigation-menu-item current-menu-item"><a href="#" aria-current="page">Etusivu</a></li>
    <li class="navigation-menu-item"><a href="#">Palvelut</a></li>
    <li class="navigation-menu-item"><a href="#">Artikkelit</a></li>
    <li class="navigation-menu-item"><a href="#">Yhteystiedot</a></li>
  </ul>
</nav>''',
  code='''import { navigationMenu } from '@front-end-framework/navigation-menu';
navigationMenu(document.querySelector('#block-navigation-menu nav > ul'), {
  translations: { name: 'Päänavigaatio', 'expand-label': 'Laajenna', 'collapse-label': 'Kutista' },
  click: true, hover: true,
  transition: 'fade',   // 'fade' tai 'slide'
});'''),

 dict(id='c-drawer', title='Drawer (piilotettava sisältö)', group='Navigointi',
  files=['core/css/drawer.css', 'theme-default/css/drawer.css', 'core/js/modules/drawer.js'],
  desc='<p>Piilottaa sisällön avausnapin taakse, esimerkiksi mobiilivalikon tai hakulomakkeen. Saman ryhmän (<code>group</code>) drawerit sulkevat toisensa, ja Esc sulkee. Ilman JavaScriptiä drawer aukeaa hoverilla ja fokuksella (<code>.no-script</code>).</p><p>Esikatselu: avausnappi on <code>.active</code>, kun drawer on auki (Figmassa <em>Icon button</em>, State=Active).</p>',
  classes=[('.drawer', 'Piilotettava alue (.open / .closed)'), ('.toggle-drawer-button', 'Avausnappi (.active kun auki)'), ('.drawer-container', 'Kääre hover-avaukselle ilman JS:ää')],
  settings=['--ff-color-button-bg-default', '--ff-color-button-bg-hover'],
  demo='''<button class="toggle-drawer-button active" type="button" aria-expanded="true" aria-controls="haku">Haku</button>
<div class="drawer open" id="haku" style="margin-top:16px">
  <form class="search-form" role="search" onsubmit="return false">
    <input class="search-form-input" type="search" placeholder="Hae…" aria-label="Hae">
    <button class="search-form-button button" type="submit">Hae</button>
  </form>
</div>''',
  code='''import { drawer } from '@front-end-framework/drawer';
drawer(document.querySelector('#block-search-form'), {
  toggleButton: '#toggle-search-form-button',   // valinnainen; muuten nappi luodaan
  group: 'header',          // saman ryhmän drawerit sulkevat toisensa
  state: 'closed',
  transition: 'slide',      // 'slide' tai 'fade'
  translations: { 'show-label': 'Näytä haku', 'hide-label': 'Piilota haku' },
});'''),

 dict(id='c-haitari', title='Haitari (accordion)', group='Sisältö',
  files=['core/css/accordion.css', 'theme-default/css/accordion.css'],
  desc='<p>Otsikot, joiden alla oleva sisältö avataan. Avoin kohta merkitään luokalla <code>.active</code> sekä otsikkoon että sisältöön; avaamisen hoitaa sivuston JavaScript. Uusissa toteutuksissa myös natiivi <code>&lt;details&gt;</code> on hyvä vaihtoehto.</p>',
  classes=[('.accordion.accordion-basic', 'Kääre'), ('.accordion-title', 'Otsikko, sisällä linkki'), ('.accordion-content', 'Sisältö (näkyy, kun .active)'), ('.active, .disabled', 'Tilat')],
  settings=['--ff-font-body', '--ff-gray-73', '--ff-color-text-primary'],
  demo='''<div class="accordion accordion-basic">
  <h3 class="accordion-title active"><a href="#">Kuinka kauan projekti kestää?</a></h3>
  <div class="accordion-content active"><p>Tyypillinen sivustoprojekti kestää 6–10 viikkoa.</p></div>
  <h3 class="accordion-title"><a href="#">Voinko päivittää sisältöä itse?</a></h3>
  <div class="accordion-content"><p>Kyllä, WordPressin lohkoeditorilla.</p></div>
</div>'''),

 dict(id='c-valilehdet', title='Välilehdet', group='Sisältö',
  files=['core/css/tabs.css', 'theme-default/css/tabs.css'],
  desc='<p>Välilehtilinkit ja niiden sisältöalueet. <code>.tabs-links</code> on kevyt versio, <code>.tabs-links-panel</code> paneelimainen. Aktiivinen välilehti ja sen sisältö saavat luokan <code>.active</code>.</p>',
  classes=[('.tabs-links, .tabs-links-panel', 'Välilehtilista'), ('li.active, li.disabled', 'Tilat'), ('.tabs-content', 'Sisältöalue (näkyy, kun .active)')],
  settings=['--ff-gray-…', '--ff-color-text-primary'],
  demo='''<ul class="tabs-links-panel" role="tablist">
  <li class="active"><a href="#" role="tab" aria-selected="true">Kuvaus</a></li>
  <li><a href="#" role="tab">Hinnat</a></li>
  <li class="disabled"><a href="#" role="tab">Arviot</a></li>
</ul>
<div class="tabs-content active" role="tabpanel"><p>Verkkosivusto WordPressillä, valmiilla komponenteilla.</p></div>'''),

 dict(id='c-listaukset', title='Listaukset', group='Sisältö',
  files=['core/css/listing.css', 'core/css/article.css', 'theme-default/css/article.css'],
  desc='<p>Sisältölistojen asettelut: pelkät otsikot, nostot (teaser), hakutulokset ja ruudukko. Artikkelin kentät (<code>.field</code>) saavat yhtenäiset välit.</p>',
  classes=[('.listing-titles', 'Otsikkolista'), ('.listing-teasers', 'Nostot allekkain'), ('.listing-grid', 'Nostot ruudukossa'), ('.listing-search-results', 'Hakutulokset'), ('.listing-item', 'Yksittäinen kohde'), ('.field, .field-image', 'Artikkelin kenttä')],
  settings=['--ff-paragraph-margin', '--ff-gutter-width'],
  demo='''<div class="listing-titles">
  <ul>
    <li><a href="#">Uusi asiakasportaali avattu</a></li>
    <li><a href="#">Saavutettavuusdirektiivi ja verkkosivut</a></li>
    <li><a href="#">Kuusi vinkkiä nopeampaan sivustoon</a></li>
  </ul>
</div>'''),

 dict(id='c-media', title='Kuvat ja media', group='Sisältö',
  files=['core/css/media.css', 'theme-default/css/media.css'],
  desc='<p>Kuvat kuvateksteineen, kelluvat kuvat ja upotetut videot (16:9-kääre). <code>.image-zoomable</code> näyttää suurennusikonin kuvassa, joka avautuu isompana.</p>',
  classes=[('.figure, .media', 'Kuva ja kuvateksti'), ('.media-caption', 'Kuvateksti'), ('.float-left, .float-right', 'Kelluva kuva'), ('.player-video, .media-youtube-video', 'Videon skaalautuva kääre'), ('.image-zoomable', 'Suurennettava kuva')],
  settings=['--ff-caption-font-size', '--ff-paragraph-margin'],
  demo=f'''<figure class="figure">
  <img src="{IMG}" alt="Maisemakuva" width="640" height="360">
  <figcaption class="media-caption">Kuvateksti kertoo, mitä kuvassa on.</figcaption>
</figure>'''),

 dict(id='c-taulukot', title='Taulukot', group='Sisältö',
  files=['core/css/elements.css', 'theme-default/css/table.css', 'core/css/tricks.css'],
  desc='<p>Taulukot saavat perustyylit ilman luokkia. <code>.table-striped</code> raidoittaa rivit, ja <code>.table-linear</code> pinoaa solut allekkain kapeilla näytöillä.</p>',
  classes=[('.table-striped', 'Raidalliset rivit'), ('.table-linear', 'Solut allekkain')],
  settings=['--ff-gray-93', '--ff-color-border-default'],
  demo='''<table class="table-striped">
  <thead><tr><th>Paketti</th><th>Sivuja</th><th>Hinta</th></tr></thead>
  <tbody>
    <tr><td>Perus</td><td>5</td><td>2 400 €</td></tr>
    <tr><td>Laaja</td><td>20</td><td>6 900 €</td></tr>
    <tr><td>Verkkokauppa</td><td>–</td><td>Tarjous</td></tr>
  </tbody>
</table>'''),

 dict(id='c-pienet', title='Paneeli, erotin ja puhekupla', group='Sisältö',
  files=['core/css/panel.css', 'core/css/separator.css', 'core/css/speech-balloon.css'],
  desc='<p><code>.panel</code> on taustavärillinen laatikko. <code>.separator</code> on vaakaviiva. Puhekupla (<code>.speech-balloon-top/-right/-bottom/-left</code>) näytetään, kun hiiri on <code>.speech-balloon-display-on-hover</code>-elementin päällä: kokeile esikatselussa.</p>',
  classes=[('.panel', 'Laatikko'), ('.separator', 'Erotinviiva'), ('.speech-balloon-target', 'Kuplan ankkuri'), ('.speech-balloon-top …', 'Kupla ja kärjen suunta'), ('.speech-balloon-display-on-hover', 'Näytä kupla hoverilla')],
  settings=['--ff-gray-93', '--ff-gray-73', '--ff-gray-80'],
  demo='''<div class="panel"><p>Tarjous on voimassa kuun loppuun.</p></div>
<div class="separator"></div>
<p style="margin-top:56px"><span class="speech-balloon-target speech-balloon-display-on-hover"><a href="#">Mikä on CMS?</a>
  <span class="speech-balloon-top">Sisällönhallintajärjestelmä, esim. WordPress.</span></span></p>'''),

 dict(id='c-apuluokat', title='Apuluokat', group='Apuvälineet',
  files=['core/css/tricks.css', 'core/css/icons.css', 'core/css/animations.css'],
  desc='<p>Pieniä apuluokkia, jotka korvaavat LESS-mixinejä. Käytä luokkaa HTML:ssä, tai kopioi säännöt sivuston valitsimeen, jos HTML:ää ei voi muuttaa.</p>',
  classes=[('.screen-reader', 'Näkyy vain ruudunlukijalle'), ('.hidden, .visible', 'Piilota / näytä'), ('.list-horizontal, .list-linear, .list-inline', 'Listat riviin tai ilman tyylejä'), ('.centered-content', 'Sisältö keskelle maksimileveyteen'), ('.full-width', 'Koko leveys'), ('.no-wrap, .hyphenation', 'Rivitys'), ('.no-icon, .no-icons', 'Piilota ikonit'), ('.spin', 'Pyörivä animaatio (latausikoni)')],
  settings=[],
  demo='''<ul class="list-horizontal">
  <li><a href="#">Tietosuoja</a></li>
  <li><a href="#">Saavutettavuus</a></li>
  <li><a href="#">Evästeet</a></li>
</ul>
<p>Teksti, jonka lopussa on <span class="screen-reader">ruudunlukijalle tarkoitettu</span> piilotettu osa.</p>'''),
]
