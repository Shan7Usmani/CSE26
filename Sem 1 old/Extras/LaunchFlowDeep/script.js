// Smooth scroll helper
function scrollToId(id){
  const el = document.getElementById(id);
  if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
}

// Intersection-based reveal
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.15});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Newsletter mock
function subscribe(e){
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if(!email){ return; }
  alert(`Thanks for subscribing, ${email}!`);
  e.target.reset();
}