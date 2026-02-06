
const themeImg = document.querySelectorAll('.theme');
let current = document.documentElement.getAttribute('data-theme');
document.getElementById('switch').addEventListener('click', () =>{
    current = current === "dark" ? "light" : "dark";
    console.log(current);
    document.documentElement.setAttribute('data-theme', current);
    themeImg.forEach(img =>{img.classList.toggle('hidden')});
})