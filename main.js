  // ---- Portfolio filter ----
  const tabs = document.querySelectorAll('.tab');
  const tiles = document.querySelectorAll('.tile');

  function applyFilter(filter){
    tiles.forEach(tile => {
      const match = filter === 'all' || tile.dataset.cat === filter;
      tile.classList.toggle('hide', !match);
    });
    tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === filter));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => applyFilter(tab.dataset.filter));
  });

  // ---- Reel (horizontal) navigation ----
  const reelViewport = document.getElementById('reelViewport');
  const frames = Array.from(document.querySelectorAll('.frame'));
  const indicatorLabel = document.getElementById('reelIndicatorLabel');
  const indicatorFill = document.getElementById('reelIndicatorFill');

  function isHorizontalMode(){
    return window.matchMedia('(min-width: 901px)').matches;
  }

  function scrollToId(id){
    const targetEl = document.getElementById(id);
    if(!targetEl) return;
    if(isHorizontalMode()){
      const frameEl = targetEl.closest('.frame');
      if(frameEl){
        reelViewport.scrollTo({ left: frameEl.offsetLeft, behavior:'smooth' });
      }
    } else {
      targetEl.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if(!id) return;
      const targetEl = document.getElementById(id);
      if(!targetEl) return;
      e.preventDefault();
      scrollToId(id);
    });
  });

  document.querySelectorAll('.filmstrip button').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.scrollCat;
      scrollToId('too');
      applyFilter(cat === 'all' ? 'all' : cat);
    });
  });

  function currentFrameIndex(){
    return Math.min(
      frames.length - 1,
      Math.max(0, Math.round(reelViewport.scrollLeft / window.innerWidth))
    );
  }

  function updateIndicator(){
    if(!isHorizontalMode()) return;
    const idx = currentFrameIndex();
    indicatorLabel.textContent = 'Kaader 0' + (idx + 1) + ' / 0' + frames.length;
    indicatorFill.style.width = (((idx + 1) / frames.length) * 100) + '%';
  }

  reelViewport.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateIndicator);
  });
  window.addEventListener('resize', updateIndicator);
  updateIndicator();

  // Translate vertical wheel input into horizontal reel movement.
  // Steps a whole frame at a time: incremental scrollLeft fights
  // scroll-snap-type:x mandatory, which snaps the reel straight back.
  let wheelLock = false;
  const VERTICAL_SLACK = 40; // ignore tiny overflow caused by rounding

  function goToFrame(index){
    const clamped = Math.min(Math.max(index, 0), frames.length - 1);
    reelViewport.scrollTo({ left: frames[clamped].offsetLeft, behavior:'smooth' });
  }

  reelViewport.addEventListener('wheel', function(e){
    if(!isHorizontalMode()) return;

    // Let a frame with real vertical content scroll itself first.
    const contentEl = e.target.closest ? e.target.closest('.frame-content') : null;
    if(contentEl){
      const overflow = contentEl.scrollHeight - contentEl.clientHeight;
      if(overflow > VERTICAL_SLACK){
        const atTop = contentEl.scrollTop <= 0;
        const atBottom = Math.ceil(contentEl.scrollTop + contentEl.clientHeight) >= contentEl.scrollHeight - 1;
        const down = e.deltaY > 0;
        if(down && !atBottom) return;
        if(!down && !atTop) return;
      }
    }

    e.preventDefault();
    if(wheelLock) return;

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if(Math.abs(delta) < 4) return;

    goToFrame(currentFrameIndex() + (delta > 0 ? 1 : -1));

    wheelLock = true;
    setTimeout(function(){ wheelLock = false; }, 620);
  }, { passive:false });

  // Keyboard arrow navigation between frames (skips form controls)
  document.addEventListener('keydown', (e) => {
    if(!isHorizontalMode()) return;
    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if(['INPUT','TEXTAREA','SELECT'].includes(activeTag)) return;
    if(e.key === 'ArrowRight'){
      goToFrame(currentFrameIndex() + 1);
    } else if(e.key === 'ArrowLeft'){
      goToFrame(currentFrameIndex() - 1);
    }
  });

  // ---- Multi-step form ----
  const steps = ['1','2','3','4','confirm'];
  let current = 0;
  const form = document.getElementById('quoteForm');
  const btnNext = document.getElementById('btnNext');
  const btnBack = document.getElementById('btnBack');
  const progressLabel = document.getElementById('progressLabel');
  const progressFill = document.getElementById('progressFill');
  const stepNav = document.getElementById('stepNav');

  function showStep(index){
    document.querySelectorAll('.form-step').forEach(el => {
      el.classList.toggle('active', el.dataset.step === steps[index]);
    });
    const isConfirm = steps[index] === 'confirm';
    stepNav.style.display = isConfirm ? 'none' : 'flex';
    btnBack.style.visibility = index === 0 ? 'hidden' : 'visible';
    if(!isConfirm){
      progressLabel.textContent = 'Kaader 0' + (index+1) + '/04';
      progressFill.style.width = ((index+1)/4*100) + '%';
    }
    btnNext.textContent = (index === 3) ? 'Saada päring' : 'Edasi →';
  }

  function validateStep(index){
    if(steps[index] === '1'){
      if(!form.querySelector('input[name="teenus"]:checked')){
        alert('Palun vali teenuse liik, et jätkata.');
        return false;
      }
    }
    if(steps[index] === '4'){
      const nimi = form.querySelector('#nimi');
      const email = form.querySelector('#email');
      if(!nimi.value.trim() || !email.value.trim() || !email.checkValidity()){
        alert('Palun täida nimi ja korrektne e-mail.');
        return false;
      }
    }
    return true;
  }

  btnNext.addEventListener('click', () => {
    if(!validateStep(current)) return;
    if(current < steps.length - 2){
      current++;
      showStep(current);
    } else {
      current = steps.length - 1;
      showStep(current);
    }
  });

  btnBack.addEventListener('click', () => {
    if(current > 0){
      current--;
      showStep(current);
    }
  });

  showStep(0);
