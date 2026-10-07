const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const list=v=>(v||'').split(',').map(s=>s.trim()).filter(Boolean);
const fmt=d=>d&&!isNaN(new Date(d))?new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'';
const PROMPT={Night:"I wrote these when I couldn't sleep.",Heartbreak:"I wrote these when I missed someone.",Unspoken:"Things I never said.",Loneliness:"I wrote these when the room was too quiet.",Rain:"Written while it rained, mostly.",Nostalgia:"Places and people that don't exist anymore.",Hope:"For the mornings that might still come.",College:"Hostel corridors, 3 a.m., unfinished problem sets.",Silence:"What remained when nobody spoke.",Friendship:"The ones who stayed.",Love:"Things that were true for a while."};
let P=[],F={q:'',mood:'',cat:'',year:'',tag:''};
function parse(t,slug){t=t.replace(/\r/g,'');const m=t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/),p={slug,body:(m?m[2]:t).trim()};
 (m?m[1]:'').split('\n').forEach(l=>{const i=l.indexOf(':');if(i>0)p[l.slice(0,i).trim()]=l.slice(i+1).trim()});
 p.moods=list(p.mood);p.cats=list(p.category);p.tagl=list(p.tags);p.type=p.type||'poem';
 p.imgs=[...p.body.matchAll(/!\[(.*?)\]\((.*?)\)/g)].map(a=>({cap:a[1],src:a[2]}));p.cover=p.cover||(p.imgs[0]||{}).src;
 p.text=p.body.replace(/!\[.*?\]\(.*?\)(\{p\})?/g,'').replace(/==/g,'').replace(/\n{3,}/g,'\n\n').trim();p.year=(p.date||'').slice(0,4);
 p.hay=[p.title,p.subtitle,p.mood,p.category,p.tags,p.date,fmt(p.date),p.location,p.note,p.body].join(' ').toLowerCase();return p}
function render(b,map={}){return b.split(/\n\s*\n/).filter(x=>x.trim()).map(bl=>{const L=bl.split('\n');
 if(L.every(l=>/^!\[.*?\]\(.*?\)/.test(l)))return `<div class="photos n${Math.min(L.length,3)}">`+L.map(l=>{const m=l.match(/!\[(.*?)\]\((.*?)\)(\{p\})?/);return `<figure class="${m[3]?'pol':''}"><img loading="lazy" src="${esc(map[m[2]]||m[2])}" alt="${esc(m[1])}" onerror="this.parentNode.classList.add('miss')"><figcaption>${esc(m[1])}</figcaption></figure>`}).join('')+'</div>';
 return '<p>'+L.map(l=>esc(l).replace(/==(.+?)==/g,'<mark>$1</mark>')).join('<br>')+'</p>'}).join('')}
const byDate=a=>[...a].sort((x,y)=>(y.date||'').localeCompare(x.date||''));
const poems=()=>byDate(P.filter(p=>p.type=='poem'));
const meta=p=>[p.moods.concat(p.cats).join(' · '),fmt(p.date),p.imgs.length?p.imgs.length+(p.imgs.length>1?' photographs':' photograph'):''].filter(Boolean).join('<br>');
const excerpt=(p,n=2)=>esc(p.text.split('\n').filter(Boolean).slice(0,n).join(' / '));
const card=p=>`<a class="card" href="#/poem/${p.slug}">${p.cover?`<div class="im"><img loading="lazy" src="${esc(p.cover)}" alt="" onerror="this.parentNode.remove()"></div>`:''}<h3>${p.type=='unsent'?'Unsent · ':''}${esc(p.title)}</h3><p>${excerpt(p)}</p><div class="meta">${meta(p)}</div></a>`;
const view=h=>{app.innerHTML=h;scrollTo(0,0)};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const ph=c=>c?`<img src="${esc(c)}" alt="" onerror="this.outerHTML='<div class=ph>a photograph, somewhere</div>'">`:'<div class="ph">a photograph, somewhere</div>';
function home(){const w=P.filter(p=>p.cover&&p.type!='fragment'),t=pick(w.length?w:poems());
 view(`<section class="hero"><h1>Some feelings are easier to write than to say.</h1><div class="sub">Words I couldn't say out loud.</div><div class="links"><a href="#/poems">Poems</a><a href="#/memories">Memories</a><a href="#/moods">Moods</a><a href="#/about">About</a></div><div class="scroll"></div></section>
 ${t?`<section class="tonight"><div>${ph(t.cover)}</div><div><div class="eyebrow">Tonight's memory</div><h2>${esc(t.title)}</h2><p>${excerpt(t,3)}</p><div class="meta">${meta(t)}</div><br><a class="btn" href="#/poem/${t.slug}">Open</a> <button class="btn" id="rnd">Read something I never planned to show you.</button></div></section>`:''}`);
 const r=$('#rnd');if(r)r.onclick=()=>{app.classList.add('out');setTimeout(()=>{location.hash='/poem/'+pick(P.filter(p=>p.type!='fragment')).slug;app.classList.remove('out')},700)}}
function poemsView(){const all=P.filter(p=>p.type!='fragment');
 const u=k=>[...new Set(all.flatMap(p=>k=='mood'?p.moods:k=='cat'?p.cats:k=='tag'?p.tagl:[p.year]).filter(Boolean))].sort();
 const sel=(k,l)=>`<select data-k="${k}"><option value="">${l}</option>${u(k).map(x=>`<option ${F[k]==x?'selected':''}>${esc(x)}</option>`).join('')}</select>`;
 view(`<div class="wrap"><h1 class="pg">Poems</h1><div class="lead">Search by a word, a rain, a year.</div><div class="tools"><input id="q" placeholder="search…" value="${esc(F.q)}">${sel('mood','Mood')}${sel('cat','Category')}${sel('year','Year')}${sel('tag','Tag')}</div><div class="grid" id="res"></div></div>`);
 const go=()=>{const q=F.q.toLowerCase(),pool=q||F.mood||F.cat||F.tag?all:poems();
  const r=byDate(pool).filter(p=>(!q||p.hay.includes(q))&&(!F.mood||p.moods.includes(F.mood))&&(!F.cat||p.cats.includes(F.cat))&&(!F.year||p.year==F.year)&&(!F.tag||p.tagl.includes(F.tag)));
  $('#res').innerHTML=r.map(card).join('')||'<p class="lead">Nothing here. Maybe it was never written.</p>'};
 $('#q').oninput=e=>{F.q=e.target.value;go()};app.querySelectorAll('select').forEach(s=>s.onchange=e=>{F[s.dataset.k]=e.target.value;go()});go()}
function poemPage(slug){const p=P.find(x=>x.slug==slug);if(!p)return poemsView();
 const s=byDate(P.filter(x=>x.type==p.type)).reverse(),i=s.findIndex(x=>x.slug==slug),pv=s[i-1],nx=s[i+1];
 view(`<article class="poem"><div class="eyebrow">${fmt(p.date)}${p.location?' — '+esc(p.location):''}</div><h1>${esc(p.title)}</h1>${p.subtitle?`<div class="subt">${esc(p.subtitle)}</div>`:''}<div style="margin-top:18px">${p.moods.concat(p.cats).map(m=>`<a class="chip" href="#/moods/${encodeURIComponent(m)}">${esc(m)}</a>`).join('')}</div><div class="body">${render(p.body)}</div>${p.note?`<div class="note">${esc(p.note)}</div>`:''}<div class="pn"><a href="#/poem/${pv?pv.slug:slug}">${pv?'← '+esc(pv.title):''}</a><a href="#/poem/${nx?nx.slug:slug}">${nx?esc(nx.title)+' →':''}</a></div></article>`)}
function moods(m){const all=P.filter(p=>p.type!='fragment');
 if(m){m=decodeURIComponent(m);return view(`<div class="wrap"><div class="eyebrow">Mood</div><h1 class="pg">${esc(m)}</h1><div class="lead">${PROMPT[m]||''}</div><div class="grid">${byDate(all.filter(p=>p.moods.includes(m)||p.cats.includes(m))).map(card).join('')}</div></div>`)}
 const c={};all.forEach(p=>p.moods.forEach(x=>c[x]=(c[x]||0)+1));
 view(`<div class="wrap"><h1 class="pg">Moods</h1><div class="lead">Not by date. By how it felt.</div>${Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<a class="mood" href="#/moods/${encodeURIComponent(k)}"><h3>${PROMPT[k]||'Written when I felt '+esc(k).toLowerCase()+'.'}</h3><span>${esc(k)} · ${n}</span></a>`).join('')}</div>`)}
function memories(){const a=byDate(P.filter(p=>p.type=='poem')).reverse(),ys=[...new Set(a.map(p=>p.year))];
 view(`<div class="wrap"><h1 class="pg">Memories</h1><div class="lead">Flip through slowly.</div><div class="tl">${ys.map(y=>`<h2>${y}</h2>`+a.filter(p=>p.year==y).map(p=>`<a class="mem" href="#/poem/${p.slug}">${p.cover?`<img loading="lazy" src="${esc(p.cover)}" alt="" onerror="this.outerHTML='<div class=ph>·</div>'">`:'<div class="ph">·</div>'}<div><div class="meta">${fmt(p.date)}${p.location?' · '+esc(p.location):''}</div><h3>${esc(p.title)}</h3><p>${esc(p.subtitle||p.text.split('\n')[0])}</p></div></a>`).join('')).join('')}</div></div>`)}
function unsent(){view(`<div class="wrap unsent-pg"><h1 class="pg" style="text-align:center">Unsent</h1><div class="lead" style="text-align:center;margin-bottom:70px">Letters I wrote but never sent.</div>${byDate(P.filter(p=>p.type=='unsent')).map(p=>`<a class="letter" href="#/poem/${p.slug}"><div class="to">${esc(p.title)}</div><p>${excerpt(p,4)}…</p><div class="stamp">${fmt(p.date)} · never sent</div></a>`).join('')||'<p class="lead" style="text-align:center">Nothing yet. Maybe that is its own letter.</p>'}</div>`)}
function fragments(){view(`<div class="wrap"><h1 class="pg">Fragments</h1><div class="lead">Loose pages. Late-night thoughts.</div><div class="frag">${byDate(P.filter(p=>p.type=='fragment')).map(p=>`<div class="f">${esc(p.text).replace(/\n/g,'<br>')}<small>${fmt(p.date)}</small></div>`).join('')}</div></div>`)}
function about(){view(`<div class="about"><h1>I write because some things become lighter when they are given words.</h1><p>By day, I work with things that either compile or don't. By night, nothing is that clear.</p><p>This is where the rest of it lives. Names are mostly missing. That is intentional.</p><p style="font:1.8rem var(--hand)">— someone, somewhere</p></div>`)}
function write(){const K='diary-draft',d=JSON.parse(localStorage.getItem(K)||'{}'),map={};
 const f=(k,l,x='')=>`<label>${l}<input id="${k}" ${x} value="${esc(d[k]||'')}"></label>`;
 view(`<div class="wrap wr"><div><h1 class="pg">Write</h1><div class="lead">Drafts stay in this browser only.</div>${f('title','Title')}${f('date','Date','type="date"')}${f('mood','Mood (comma separated)')}${f('category','Category')}${f('tags','Tags')}${f('location','Location')}<label>Type<select id="type">${['poem','unsent','fragment'].map(x=>`<option ${d.type==x?'selected':''}>${x}</option>`).join('')}</select></label>${f('note','Memory / note')}<label>Poetry — markdown: ==highlight==, ![caption](images/x.jpg)<textarea id="body">${esc(d.body||'')}</textarea></label><label>Photographs<input type="file" id="ph" accept="image/*" multiple></label><div class="meta" id="cnt"></div><br><button class="btn" id="dl">Download .md</button> <button class="btn" id="cl">Clear draft</button></div><div class="pv"><div class="eyebrow">Preview</div><h1 id="pt" style="margin-top:10px;font-size:3rem"></h1><div class="body" id="pb"></div></div></div>`);
 const ids=['title','date','mood','category','tags','location','type','note','body'],data=()=>Object.fromEntries(ids.map(k=>[k,$('#'+k).value]));
 const upd=()=>{const v=data();localStorage.setItem(K,JSON.stringify(v));$('#pt').textContent=v.title;$('#pb').innerHTML=render(v.body,map);$('#cnt').textContent=v.body.trim().split(/\s+/).filter(Boolean).length+' words · '+v.body.length+' characters · draft saved'};
 ids.forEach(k=>$('#'+k).oninput=upd);
 $('#ph').onchange=e=>{[...e.target.files].forEach(fl=>{map['images/'+fl.name]=URL.createObjectURL(fl);$('#body').value+=`\n\n![caption](images/${fl.name})`});upd()};
 $('#cl').onclick=()=>{if(confirm('Clear the draft?')){localStorage.removeItem(K);write()}};
 $('#dl').onclick=()=>{const v=data(),slug=(v.title||'untitled').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),fm=['title','date','mood','category','tags','location','type','note'].filter(k=>v[k]).map(k=>k+': '+v[k].replace(/\n/g,' ')).join('\n'),a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([`---\n${fm}\n---\n\n${v.body}\n`],{type:'text/markdown'}));a.download=slug+'.md';a.click()};upd()}
function route(){const [r,a]=location.hash.slice(2).split('/');({'':home,poems:poemsView,poem:()=>poemPage(a),moods:()=>moods(a),memories,unsent,fragments,about,write}[r]||home)();$('#nav').classList.remove('open')}
document.addEventListener('click',e=>{if(e.target.matches('figure img')){const l=$('#lb');l.querySelector('img').src=e.target.src;l.querySelector('p').textContent=e.target.alt;l.hidden=false}else if(e.target.closest('#lb'))$('#lb').hidden=true});
$('#burger').onclick=()=>$('#nav').classList.toggle('open');
document.documentElement.dataset.theme=localStorage.getItem('theme')||'dark';
$('#theme').onclick=()=>{const n=document.documentElement.dataset.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('theme',n)};
addEventListener('hashchange',route);
fetch('content/index.json').then(r=>r.json()).then(fs=>Promise.all(fs.map(f=>fetch('content/poems/'+f).then(r=>r.text()).then(t=>parse(t,f.replace(/\.md$/,'')))))).then(a=>{P=a;route()}).catch(()=>{app.innerHTML='<div class="about"><h1>The pages are closed.</h1><p>Serve over http (GitHub Pages, or python -m http.server). Opened directly as a file, the content cannot load.</p></div>'});
