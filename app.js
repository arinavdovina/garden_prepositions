'use strict';
const $=id=>document.getElementById(id);
let layout=Array(8).fill(null),growth=Object.fromEntries(PLANTS.map(p=>[p,0])),mode='plant',tool='water',selected=null,active=null,answered=false,hoverTimer=null,dragging=null;
const asset=(id,stage)=>`assets/${id}-${stage}.webp`;
function say(text){$('status').textContent=text;}
function render(){
 $('plots').replaceChildren();
 layout.forEach((id,i)=>{
  const b=document.createElement('button'); b.className='plot'+(!id?' empty':'')+(selected===id&&id?' selected':'');b.dataset.slot=i;
  b.style.left=[18,39,61,82][i%4]+'%';b.style.top=((i<4?26:50)+(id?0:13))+'%';
  b.setAttribute('aria-label',`${i<4?'Back':'Front'} row, patch ${i%4+1}${id?': plant, stage '+(growth[id]+1):', empty'}`);
  if(id){b.innerHTML=`<img src="${asset(id,growth[id])}" style="height:${[45,65,82,100][growth[id]]}%" alt=""><span class="stage-dots" aria-hidden="true">${'●'.repeat(growth[id]+1)}${'○'.repeat(3-growth[id])}</span>`;b.draggable=mode!=='grow'||tool==='move';}
  else b.innerHTML='<span aria-hidden="true">+</span>';
  b.onclick=()=>choosePlot(i);
  b.onpointerenter=e=>{if(e.pointerType==='mouse'&&mode==='grow'&&tool==='water'&&id&&growth[id]<3&&!$('question').open){clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>ask(id),900);}};
  b.onpointerleave=()=>clearTimeout(hoverTimer);
  b.ondragstart=e=>{dragging=id;e.dataTransfer.setData('text/plain',id);clearTimeout(hoverTimer);};
  b.ondragend=()=>{dragging=null;};
  b.ondragover=e=>{if(dragging){e.preventDefault();b.classList.add('drop-target');}};
  b.ondragleave=()=>b.classList.remove('drop-target');
  b.ondrop=e=>{e.preventDefault();if(dragging){selected=dragging;moveTo(i);dragging=null;}};
  $('plots').append(b);
 });
 $('plant-list').replaceChildren();
 PLANTS.forEach(id=>{const b=document.createElement('button');b.className='seed'+(selected===id?' selected':'')+(layout.includes(id)?' placed':'');b.disabled=layout.includes(id);b.draggable=!b.disabled;b.dataset.plant=id;b.setAttribute('aria-label','Plant '+(PLANTS.indexOf(id)+1));b.innerHTML=`<img src="${asset(id,0)}" alt="">`;b.onclick=()=>{selected=id;render();say('Put your plant on a patch of soil.');};b.ondragstart=e=>{dragging=id;e.dataTransfer.setData('text/plain',id);};b.ondragend=()=>dragging=null;$('plant-list').append(b);});
 $('plant-shelf').hidden=mode!=='plant';$('plant-info').hidden=mode!=='plant';$('grow-info').hidden=mode!=='grow';$('final-info').hidden=mode!=='final';$('tools').hidden=mode!=='grow';$('final-button').hidden=mode==='final';
 ['plant','grow','final'].forEach(m=>$('step-'+m).classList.toggle('active',mode===m));
 $('title').textContent=mode==='plant'?'Where will your garden grow?':mode==='grow'?'A little English. A little growth.':'Can you solve the garden riddle?';
 $('chapter').textContent=mode==='final'?'PREPOSITIONS OF PLACE':mode==='grow'?'PREPOSITIONS OF TIME':'YOUR LITTLE PATCH OF GREEN';
 const grown=PLANTS.filter(p=>growth[p]===3);$('growth-count').textContent=mode==='plant'?`${layout.filter(Boolean).length} / 8 planted`:`${grown.length} / 8 fully grown`;
 $('harvest-count').textContent=`${grown.length} / 8`;$('harvest-items').innerHTML=grown.map(p=>`<img src="assets/fruit-${p}.webp" alt="Harvest item">`).join('');
 $('water-tool').setAttribute('aria-pressed',tool==='water');$('move-tool').setAttribute('aria-pressed',tool==='move');
 $('tool-tip').textContent=tool==='water'?'Hold the can over a plant, or tap a plant.':'Tap a plant, then another patch. You can also drag.';
 $('watering-pointer').hidden=true;
}
function choosePlot(i){const id=layout[i];if(mode==='grow'&&tool==='water'){if(id)ask(id);return;}if(selected){moveTo(i);return;}if(id){selected=id;render();say('Move your plant. Tap another patch.');}else say('Choose a plant below first.');}
function moveTo(i){if(!selected)return;const from=layout.indexOf(selected);if(from===i){selected=null;render();return;}if(from>=0){[layout[from],layout[i]]=[layout[i],layout[from]];}else if(!layout[i])layout[i]=selected;else{say('Choose an empty patch for your new plant.');return;}selected=null;clearClues();if(mode==='plant'&&layout.every(Boolean)){mode='grow';render();say('All planted! Answer your first question to help a plant grow.');ask(layout[i]);}else{render();say(mode==='final'?'Read the clues, then check your garden.':mode==='plant'?'Lovely! Choose another little plant.':'Your plant has a new home.');}}
function ask(id){clearTimeout(hoverTimer);if(mode!=='grow'||$('question').open)return;if(growth[id]===3){say('This plant is fully grown! Its harvest is in your box.');return;}active=id;answered=false;const q=QUESTIONS[PLANTS.indexOf(id)*3+growth[id]];$('question-title').textContent='Grow your plant';$('question-plant').src=asset(id,growth[id]);$('stage-label').textContent=`Stage ${growth[id]+1} → ${growth[id]+2} of 4`;$('sentence').textContent=q[0];$('answer-feedback').textContent='Choose the missing word.';$('continue').hidden=true;document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=false;b.className='';});$('watering-pointer').hidden=true;$('question').showModal();}
for(const b of document.querySelectorAll('[data-answer]'))b.onclick=()=>{if(answered)return;const q=QUESTIONS[PLANTS.indexOf(active)*3+growth[active]];if(b.dataset.answer!==q[1]){b.classList.add('wrong');$('answer-feedback').textContent='Try again.';return;}answered=true;growth[active]++;b.className='right';$('sentence').textContent=q[0].replace('___',q[1]);$('answer-feedback').textContent='Yes! Your plant has grown!';document.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);$('question-plant').src=asset(active,growth[active]);$('question-plant').classList.remove('grow-pop');void $('question-plant').offsetWidth;$('question-plant').classList.add('grow-pop');$('continue').hidden=false;render();$('continue').focus();};
function closeQuestion(){$('question').close();active=null;clearTimeout(hoverTimer);say('Choose a plant to water, or try the final round.');}
$('continue').onclick=closeQuestion;$('close-question').onclick=closeQuestion;$('question').addEventListener('cancel',()=>{active=null;clearTimeout(hoverTimer);});
function clearClues(){document.querySelectorAll('#clues li').forEach(li=>{li.className='';li.removeAttribute('aria-label');});}
CLUES.forEach(c=>{const li=document.createElement('li');li.textContent=c.text;$('clues').append(li);});
$('final-button').onclick=()=>{clearTimeout(hoverTimer);const missing=PLANTS.filter(p=>!layout.includes(p));layout=layout.map(p=>p||missing.shift());mode='final';selected=null;clearClues();render();say('Tap a plant, then another plant to swap their places.');};
function growMode(){mode='grow';selected=null;tool='water';render();say('Choose a plant to water. You can return to the riddle at any time.');}
$('back-grow').onclick=growMode;
$('check-final').onclick=()=>{if(checkGarden(layout).every(Boolean)){$('win').showModal();say('You solved every clue!');}else say('Not quite yet. Try again.');};
$('keep-growing').onclick=()=>{$('win').close();growMode();};
function reset(){clearTimeout(hoverTimer);document.querySelectorAll('dialog[open]').forEach(d=>d.close());layout=Array(8).fill(null);growth=Object.fromEntries(PLANTS.map(p=>[p,0]));mode='plant';tool='water';selected=active=dragging=null;clearClues();render();say('Pick a plant below. Then tap a patch of soil.');}
$('restart').onclick=()=>$('restart-dialog').showModal();$('cancel-restart').onclick=()=>$('restart-dialog').close();$('confirm-restart').onclick=reset;$('new-garden').onclick=reset;
$('water-tool').onclick=()=>{tool='water';selected=null;render();say('Hold the can over a plant, or tap a plant.');};$('move-tool').onclick=()=>{tool='move';clearTimeout(hoverTimer);render();say('Tap a plant, then another patch to move it.');};
$('garden').onpointermove=e=>{if(e.pointerType!=='mouse'||mode!=='grow'||tool!=='water'||$('question').open)return;const rect=$('garden').getBoundingClientRect();$('watering-pointer').style.left=e.clientX-rect.left+'px';$('watering-pointer').style.top=e.clientY-rect.top+'px';$('watering-pointer').hidden=false;};$('garden').onpointerleave=()=>{$('watering-pointer').hidden=true;clearTimeout(hoverTimer);};
render();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_garden',description:'Read the current garden stage, plant positions and growth.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({mode,layout:[...layout],growth:{...growth}})})).catch(()=>{});}catch{}}
