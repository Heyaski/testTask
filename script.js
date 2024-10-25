// Кэширование основных элементов
const popup = document.getElementById('popup1')
const overlay = document.querySelector('.overlay')
const inputProjects = document.getElementById('inputProjects')
const inputFolders = document.getElementById('inputFolders')
const selectWrapperProjects = document.getElementById('projects')
const selectWrapperFolders = document.getElementById('folders')
const enterDataFields = document.querySelectorAll('.enterData input')
const notAutoFields = document.querySelectorAll('.notAuto input')
const autoFields = document.querySelectorAll('.auto input')
const checkbox = document.querySelector('.switch input')
const preloader = document.getElementById('preloader')
const saveButton = document.querySelector('.save')
const createWrapper = document.querySelector('.create-wrapper')
const folderList = document.getElementById('folderList')
const folderNameInput = document.getElementById('folderNameInput')

// Общая функция для открытия и сброса значений в popup
function openPopup() {
	enterDataFields.forEach(input => (input.value = ''))
	notAutoFields.forEach(input => (input.value = ''))
	autoFields.forEach(input => (input.value = ''))
	document.querySelector('.connection').style.display = 'flex'
	document.querySelector('.notAuto').style.display = 'flex'
	document.querySelector('.finish').style.display = 'none'
	checkbox.checked = false
	toggleFields(checkbox)

	popup.classList.add('active')
	overlay.classList.add('active')
	resetSelects()
}

// Общая функция для закрытия popup
function closePopup() {
	popup.classList.remove('active')
	overlay.classList.remove('active')
	resetSelects()
	enterDataFields.forEach(input => (input.value = ''))
	document.querySelector('.finish').style.display = 'none'
	document.querySelector('.enterData').style.display = 'none'
	document.querySelector('.enter').style.display = 'none'
	document.querySelector('.done').style.display = 'none'
	document.querySelector('.switch-wrapper').style.display = 'flex'
	document.querySelector('.info').style.display = 'flex'
	document.querySelector('.connect').style.display = 'block'
}

// Сбрасываем текст и цвет элементов select
function resetSelects() {
	inputProjects.options[0].textContent = 'Выберите проект из списка'
	inputProjects.style.color = '#bbbbbb'
	inputFolders.options[0].textContent =
		'Выберите или создайте папку для проекта'
	inputFolders.style.color = '#bbbbbb'
}

// Переключение отображения полей в зависимости от состояния чекбокса
function toggleFields(checkbox) {
	const notAuto = document.querySelector('.notAuto')
	const auto = document.querySelector('.auto')

	if (checkbox.checked) {
		notAuto.style.display = 'none'
		auto.style.display = 'block'
	} else {
		notAuto.style.display = 'block'
		auto.style.display = 'none'
	}
}

// Открытие popup
document.getElementById('newProjectBtn').addEventListener('click', openPopup)

// Закрытие popup при клике на "Отменить" или крестик
document
	.querySelectorAll('.close-btn, .secondary')
	.forEach(button => button.addEventListener('click', closePopup))

// Управляем отображением списков проектов и папок
inputProjects.addEventListener('click', () => {
	selectWrapperProjects.style.display = 'flex'
	selectWrapperFolders.style.display = 'none'
})

inputFolders.addEventListener('click', () => {
	selectWrapperProjects.style.display = 'none'
	selectWrapperFolders.style.display = 'flex'
})

// Выбор проекта из списка
document.querySelectorAll('.select').forEach(div => {
	div.addEventListener('click', () => {
		const projectValue = div.getAttribute('data-value')
		updateSelect(inputProjects, projectValue, div.textContent)
		selectWrapperProjects.style.display = 'none'
	})
})

// Выбор папки из списка
document.querySelectorAll('.selectFolder').forEach(div => {
	div.addEventListener('click', () => {
		const folderValue = div.getAttribute('data-value')
		updateSelect(inputFolders, folderValue, div.textContent)
		selectWrapperFolders.style.display = 'none'
		createWrapper.style.display = 'none'
	})
})

// Обновление значения по умолчанию и цвета в select
function updateSelect(selectElement, value, text) {
	selectElement.options[0].value = value
	selectElement.options[0].textContent = text
	selectElement.selectedIndex = 0
	selectElement.style.color = '#404040'
}

// Создание новой папки
document.getElementById('createFolderBtn').addEventListener('click', () => {
	const folderName = folderNameInput.value.trim()
	if (folderName) {
		// Создаем новый элемент для новой папки
		const newFolderDiv = document.createElement('div')
		newFolderDiv.classList.add('selectFolder')
		newFolderDiv.setAttribute('data-value', folderName)

		// Создаем элемент img и добавляем его в папку
		const folderIcon = document.createElement('img')
		folderIcon.src = 'img/folder.png'

		// Добавляем иконку и текст в newFolderDiv
		newFolderDiv.appendChild(folderIcon)
		newFolderDiv.appendChild(document.createTextNode(folderName))

		// Добавляем новый div в список папок
		folderList.appendChild(newFolderDiv)

		// Добавляем обработчик клика на новую папку
		newFolderDiv.addEventListener('click', () => {
			updateSelect(inputFolders, folderName, folderName)
			selectWrapperFolders.style.display = 'none'
		})

		// Скрываем элементы и очищаем поле ввода
		folderNameInput.value = ''
		createWrapper.style.display = 'none'
		document.querySelector('.createNewFolder').style.display = 'flex'
	} else {
		alert('Введите название папки')
	}
})

// Открытие формы создания новой папки
document.getElementById('newFolderBtn').addEventListener('click', () => {
	createWrapper.style.display = 'flex'
	document.querySelector('.createNewFolder').style.display = 'none'
})

// Обработчик переключения чекбокса
checkbox.addEventListener('change', function () {
	toggleFields(this)
})

// Обработчик сохранения данных
saveButton.addEventListener('click', () => {
	const name = document.getElementById('nameProject')
	const project = inputProjects

	validateField(
		name,
		name.value.trim() !== '',
		'Необходимо указать название проекта'
	)
	validateField(project, project.value !== '', 'Необходимо выбрать проект')

	if (name.value.trim() && project.value) {
		document.querySelector('.enterData').style.display = 'none'
		document.querySelector('.done').style.display = 'block'
		document.querySelector('.finish').style.display = 'flex'
		document.querySelector('.icon').setAttribute('src', 'img/done.png')
		resetSelects()
	}
})

// Валидация полей и отображение предупреждений
function validateField(field, isValid, warningText) {
	const warningElement = field.nextElementSibling
	if (isValid) {
		field.style.border = '1px solid #bbbbbb'
		warningElement.style.display = 'none'
	} else {
		field.style.border = '1px solid #E50C00'
		warningElement.style.display = 'block'
		warningElement.textContent = warningText
	}
}

// Завершение подключения
document.querySelector('.okay').addEventListener('click', closePopup)

document.querySelector('.cancel').addEventListener('click', closePopup)

// Обработка клика вне `select-wrapper` для его скрытия
document.addEventListener('click', event => {
	if (
		!selectWrapperProjects.contains(event.target) &&
		event.target !== inputProjects
	) {
		selectWrapperProjects.style.display = 'none'
	}
	if (
		!selectWrapperFolders.contains(event.target) &&
		event.target !== inputFolders
	) {
		selectWrapperFolders.style.display = 'none'
	}
})

// Обработка основной кнопки подключения
document.querySelector('.primary').addEventListener('click', () => {
	document.querySelector('.buttons').style.display = 'none'
	document.querySelector('.connection').style.display = 'none'
	preloader.style.display = 'block'
	setTimeout(() => {
		preloader.style.display = 'none'
		document.querySelector('.enterData').style.display = 'block'
		document.querySelector('.notAuto').style.display = 'none'
		document.querySelector('.auto').style.display = 'none'
		document.querySelector('.switch-wrapper').style.display = 'none'
		document.querySelector('.info').style.display = 'none'
		document.querySelector('.connect').style.display = 'none'
		document.querySelector('.enter').style.display = 'flex'
	}, 3000)
})
