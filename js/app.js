(function(){
  const grid = document.getElementById('grid');
  const search = document.getElementById('search');
  const modal = document.getElementById('modal');
  const pdfFrame = document.getElementById('pdfFrame');
  const closeBtn = document.getElementById('closeBtn');
  let ebooks = [];

  function createCard(item){
    const el = document.createElement('div');
    el.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.textContent = item.title.split(' ').slice(0,2).map(s=>s[0]).join('');

    const meta = document.createElement('div');
    meta.className = 'meta';

    const h = document.createElement('h3');
    h.className = 'title';
    h.textContent = item.title;

    const p = document.createElement('div');
    p.className = 'desc';
    p.textContent = item.description || item.file;

  const actions = document.createElement('div');
  actions.className = 'actions';

  // View button
  const view = document.createElement('button');
  view.className = 'btn';
  view.type = 'button';
  view.setAttribute('aria-label', `View ${item.title}`);
  view.innerHTML = '<strong>View</strong> — open in viewer';
  view.addEventListener('click', ()=>openModal(item.file));

  // Open in tab
  const open = document.createElement('a');
  open.className = 'btn secondary';
  open.setAttribute('aria-label', `Open ${item.title} in new tab`);
  open.innerHTML = '<strong>Open in Tab</strong> — open in new tab';
  open.href = encodeURI(item.file);
  open.target = '_blank';

  // Download
  const dl = document.createElement('a');
  dl.className = 'btn';
  dl.setAttribute('aria-label', `Download ${item.title}`);
  dl.innerHTML = '<strong>Download</strong> — save file';
  dl.href = encodeURI(item.file);
  dl.download = '';

  actions.appendChild(view);
  actions.appendChild(open);
  actions.appendChild(dl);

    meta.appendChild(h);
    meta.appendChild(p);
    meta.appendChild(actions);

    el.appendChild(thumb);
    el.appendChild(meta);

    return el;
  }

  function render(list){
    grid.innerHTML = '';
    if(list.length === 0){
      grid.innerHTML = '<p style="padding:20px;color:#444">No ebooks found.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(item => frag.appendChild(createCard(item)));
    grid.appendChild(frag);
  }

  function openModal(file){
    // Use PDF viewer in iframe. For some browsers, PDFs open fine. Otherwise user can open in new tab.
    pdfFrame.src = encodeURI(file);
    modal.classList.remove('hidden');
  }

  function closeModal(){
    pdfFrame.src = '';
    modal.classList.add('hidden');
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

  search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    if(!q) return render(ebooks);
    const filtered = ebooks.filter(e=> (e.title+" "+e.file+" "+(e.description||'')).toLowerCase().includes(q));
    render(filtered);
  });

  // Load catalog
  fetch('ebooks.json').then(r=>r.json()).then(data=>{
    ebooks = data;
    render(ebooks);
  }).catch(err=>{
    grid.innerHTML = '<p style="padding:20px;color:red">Failed to load ebook catalog. Make sure you are running this from a web server (not file://). Error: '+err.message+'</p>';
    console.error(err);
  });
})();