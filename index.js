const searchWrapper = document.querySelector('.search-input')
const inputBox = searchWrapper.querySelector('input')
const sugBox = searchWrapper.querySelector('.auto-box')
const reposList = document.querySelector('.repo-list')

let temp

function debounce(func, timeout = 400) {
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

const searchChange = debounce(() => searchRepo(), 600)

inputBox.addEventListener('keyup', searchChange)

sugBox.addEventListener('click', function (e) {
    temp.forEach(item => {
        if (item.name === e.target.innerHTML) {
            createRepo(item)
        }
    })
})



function createSug(repo) {
    let arr = repo.slice(0, 5);
    temp = arr;
    console.log(temp)
    let arr1 = arr.map((item) => {
        return item = `<li>${item.name}</li>`
    });
    searchWrapper.classList.add('active');
    showSuggestions(arr1);
    let allList = sugBox.querySelectorAll('li')
    for (let i = 0; i < allList.length; i++) {
        allList[i].setAttribute('onClick', 'select(this)')
    }
}

function select(element) {
    inputBox.value = element.textContent;
    searchWrapper.classList.remove('active')
    inputBox.value = ''
}

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        listData = `<li>${inputBox.value}</li>`
    } else {
        listData = list.join('')
    }
    sugBox.innerHTML = listData
}

function createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) element.classList.add(elementClass);
    return element;
}

function createRepo(repoData) {
    const repoElement = createElement('li', 'repo-pin');
    repoElement.innerHTML = `<div class="pin-wrapper">
                                <div class="repoName"> Name: ${repoData.name}</div>
                                <div class="repoOwner"> Owner: ${repoData.owner.login}</div>
                                <div class="repoStars"> Stars: ${repoData.stargazers_count}</div>
                            </div>
                            <div class="delete-wrapper">
                            <div class="close"></div>
                            </div>`
    reposList.append(repoElement)
}





