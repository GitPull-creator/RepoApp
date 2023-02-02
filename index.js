const searchWrapper = document.querySelector('.search-input')
const inputBox = searchWrapper.querySelector('input')
const sugBox = searchWrapper.querySelector('.auto-box')
const reposList = document.querySelector('.repo-list')
let temp

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

async function searchRepo() {
    return await fetch(`https://api.github.com/search/repositories?q=${inputBox.value}`)
        .then((res) => {
            if (res.ok) {
                res.json()
                    .then((res) => createSug(res.items))
            }
        })

}

const searchChange = debounce(() => searchRepo());

inputBox.addEventListener('change', searchChange)

sugBox.addEventListener('click', function (e) {
    temp.forEach(item => {
        if (item.name === e.target.textContent) {
            createRepo(item)
            searchWrapper.classList.remove('active')
            inputBox.value = '';
            while (sugBox.lastChild) sugBox.removeChild(sugBox.lastChild);
        }
    })
})
const deleteList = function (e) {
    if (e.target.classList.contains("close")) {
        e.target.parentElement.remove()
    }
}

reposList.addEventListener('click', deleteList)


function createSug(repo) {
    let arr = repo.slice(0, 5);
    temp = arr;
    let mutableArr = arr.map((item) => {
        return `${item.name}`
    });
    console.log(mutableArr)
    searchWrapper.classList.add('active');
    showSuggestions(mutableArr);

}

function showSuggestions(list) {
    for (let i = 0; i < list.length; i++) {
        let el = document.createElement('li');
        el.textContent = `${list[i]}`;
        sugBox.append(el)
    }
}

function createRepo(repoData) {
    reposList.insertAdjacentHTML('beforeend', `<li class="repo-pin">
                                <div class="repoName"> Name: ${repoData.name}</div>
                                <div class="repoOwner"> Owner: ${repoData.owner.login}</div>
                                <div class="repoStars"> Stars: ${repoData.stargazers_count}</div>
                                <div class="close"></div>
                                                           </li>`)
}





