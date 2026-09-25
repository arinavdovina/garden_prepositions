'use strict';
const PLANTS=['sunflower','tomato','strawberry','pepper','cucumber','corn','aubergine','peas'];
const NAMES={sunflower:'Sunflower',tomato:'Tomato',strawberry:'Strawberry',pepper:'Pepper',cucumber:'Cucumber',corn:'Corn',aubergine:'Aubergine',peas:'Peas'};
const QUESTIONS=[
 ['I water my plants ___ the morning.','in','parts of the day'],['We visit the garden ___ Monday.','on','days'],['I get up ___ seven o’clock.','at','clock times'],
 ['We plant seeds ___ spring.','in','seasons'],['I help Mum ___ Saturday.','on','days'],['We have lunch ___ noon.','at','noon'],
 ['We pick strawberries ___ June.','in','months'],['My birthday is ___ 5 May.','on','dates'],['I go to bed ___ nine o’clock.','at','clock times'],
 ['I play outside ___ the afternoon.','in','parts of the day'],['We have a picnic ___ Sunday.','on','days'],['The stars come out ___ night.','at','night'],
 ['It is hot ___ summer.','in','seasons'],['We go to the park ___ Friday.','on','days'],['School starts ___ eight o’clock.','at','clock times'],
 ['We read books ___ the evening.','in','parts of the day'],['I have art ___ Tuesday.','on','days'],['I eat breakfast ___ half past seven.','at','clock times'],
 ['My birthday is ___ April.','in','months'],['We play tennis ___ Wednesday.','on','days'],['The film starts ___ six o’clock.','at','clock times'],
 ['It is cold ___ winter.','in','seasons'],['I visit Grandma ___ Thursday.','on','days'],['We have dinner ___ half past six.','at','clock times']
];
// Slots 0–3 are the back row; 4–7 are the front row, from left to right.
function position(layout,id){const i=layout.indexOf(id);return {i,row:Math.floor(i/4),col:i%4};}
const CLUES=[
 {text:'The corn is in the front row, on the left.',test:l=>l[4]==='corn'},
 {text:'The sunflower is behind the corn.',test:l=>behind(l,'sunflower','corn')},
 {text:'The tomato is next to the sunflower, on its right.',test:l=>rightNext(l,'tomato','sunflower')},
 {text:'The peas are between the tomato and the pepper.',test:l=>between(l,'peas','tomato','pepper')},
 {text:'The strawberry is in front of the tomato.',test:l=>behind(l,'tomato','strawberry')},
 {text:'The cucumber is in front of the peas.',test:l=>behind(l,'peas','cucumber')},
 {text:'The aubergine is next to the cucumber, on its right.',test:l=>rightNext(l,'aubergine','cucumber')},
 {text:'The pepper is behind the aubergine.',test:l=>behind(l,'pepper','aubergine')}
];
function behind(l,a,b){const x=position(l,a),y=position(l,b);return x.i>=0&&y.i>=0&&x.row===0&&y.row===1&&x.col===y.col;}
function rightNext(l,a,b){const x=position(l,a),y=position(l,b);return x.i>=0&&y.i>=0&&x.row===y.row&&x.col===y.col+1;}
function between(l,a,b,c){const x=position(l,a),y=position(l,b),z=position(l,c);return x.i>=0&&y.i>=0&&z.i>=0&&x.row===y.row&&x.row===z.row&&Math.abs(y.col-z.col)===2&&x.col===(y.col+z.col)/2;}
function checkGarden(layout){return CLUES.map(c=>c.test(layout));}
