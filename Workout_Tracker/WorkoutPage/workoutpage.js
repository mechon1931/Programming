 // Calendar Functionality
        function renderCalendar() {
            const today = new Date();
            let currentDate = new Date(today);
            let isWeekView = true;
            let selectedDate = null;

            const weekYear = document.getElementById('week-year');
            const calendarDays = document.getElementById('calendar-days');
            const prevWeek = document.getElementById('prev-week');
            const nextWeek = document.getElementById('next-week');
            const toggleView = document.getElementById('toggle-view');
            const dateExerciseForm = document.getElementById('date-exercise-form');
            const selectedDateSpan = document.getElementById('selected-date');
            const dateExerciseList = document.getElementById('date-exercise-list');

            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            function updateCalendar() {
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();
                weekYear.textContent = `${months[currentMonth]} ${currentYear}`;

                // Clear previous days
                calendarDays.innerHTML = '';

                if (isWeekView) {
                    // Week view: Show Sunday to Saturday
                    const startOfWeek = new Date(currentDate);
                    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

                    for (let i = 0; i < 7; i++) {
                        const day = new Date(startOfWeek);
                        day.setDate(startOfWeek.getDate() + i);
                        const div = document.createElement('div');
                        div.className = `p-2 rounded-full cursor-pointer ${
                            day.toDateString() === today.toDateString() ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`;
                        div.textContent = day.getDate();
                        div.addEventListener('click', () => {
                            selectedDate = day;
                            showDateExerciseForm();
                        });
                        calendarDays.appendChild(div);
                    }
                } else {
                    // Month view: Show all days in the month
                    const firstDay = new Date(currentYear, currentMonth, 1);
                    const lastDay = new Date(currentYear, currentMonth + 1, 0);
                    const startDay = firstDay.getDay();
                    const totalDays = lastDay.getDate();

                    // Add empty cells for days before the first day of the month
                    for (let i = 0; i < startDay; i++) {
                        const div = document.createElement('div');
                        div.className = 'p-2';
                        calendarDays.appendChild(div);
                    }

                    // Add days of the month
                    for (let day = 1; day <= totalDays; day++) {
                        const dayDate = new Date(currentYear, currentMonth, day);
                        const div = document.createElement('div');
                        div.className = `p-2 rounded-full cursor-pointer ${
                            dayDate.toDateString() === today.toDateString() ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`;
                        div.textContent = day;
                        div.addEventListener('click', () => {
                            selectedDate = dayDate;
                            showDateExerciseForm();
                        });
                        calendarDays.appendChild(div);
                    }
                }
            }

            function showDateExerciseForm() {
                if (selectedDate) {
                    dateExerciseForm.classList.remove('hidden');
                    selectedDateSpan.textContent = selectedDate.toDateString();
                    loadDateExercises();
                } else {
                    dateExerciseForm.classList.add('hidden');
                }
            }

            function loadDateExercises() {
                const dateKey = selectedDate.toDateString();
                const exercises = JSON.parse(localStorage.getItem(`exercises_${dateKey}`)) || [];
                dateExerciseList.innerHTML = '';
                exercises.forEach((exercise, index) => {
                    const li = document.createElement('li');
                    li.className = 'p-4 bg-gray-100 rounded-lg shadow mb-4';

                    // Exercise header
                    const header = document.createElement('div');
                    header.className = 'flex justify-between items-center mb-2';
                    header.innerHTML = `<strong>${exercise.name}</strong> - Set 1`;
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'flex gap-2 items-center';
                    const checkmark = document.createElement('button');
                    checkmark.className = `w-6 h-6 rounded-full flex items-center justify-center ${
                        exercise.completed ? 'bg-green-500' : 'bg-yellow-400'
                    }`;
                    checkmark.innerHTML = '✔';
                    checkmark.addEventListener('click', () => {
                        exercise.completed = !exercise.completed;
                        saveDateExercises(exercises);
                        loadDateExercises();
                    });
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600';
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => {
                        exercises.splice(index, 1);
                        saveDateExercises(exercises);
                        loadDateExercises();
                    });
                    buttonContainer.appendChild(checkmark);
                    buttonContainer.appendChild(deleteButton);
                    header.appendChild(buttonContainer);
                    li.appendChild(header);

                    // Reps counter
                    const repsContainer = document.createElement('div');
                    repsContainer.className = 'flex items-center justify-center gap-4 mb-2';
                    const minusButton = document.createElement('button');
                    minusButton.className = 'bg-gray-300 text-black px-2 py-1 rounded-lg hover:bg-gray-400';
                    minusButton.textContent = '-';
                    minusButton.addEventListener('click', () => {
                        exercise.reps = Math.max(0, exercise.reps - 1);
                        saveDateExercises(exercises);
                        loadDateExercises();
                    });
                    const repsDisplay = document.createElement('span');
                    repsDisplay.textContent = exercise.reps;
                    const plusButton = document.createElement('button');
                    plusButton.className = 'bg-gray-300 text-black px-2 py-1 rounded-lg hover:bg-gray-400';
                    plusButton.textContent = '+';
                    plusButton.addEventListener('click', () => {
                        exercise.reps = exercise.reps + 1;
                        saveDateExercises(exercises);
                        loadDateExercises();
                    });
                    repsContainer.appendChild(minusButton);
                    repsContainer.appendChild(repsDisplay);
                    repsContainer.appendChild(plusButton);
                    li.appendChild(repsContainer);

                    // Reps card
                    const repsCard = document.createElement('div');
                    repsCard.className = 'p-4 bg-white rounded-lg shadow text-center';
                    
                    li.appendChild(repsCard);
                    repsCard.textContent = `Reps: ${exercise.reps}`;

                    dateExerciseList.appendChild(li);
                });
            }

            function saveDateExercises(exercises) {
                const dateKey = selectedDate.toDateString();
                localStorage.setItem(`exercises_${dateKey}`, JSON.stringify(exercises));
            }

            // Toggle between week and month view
            toggleView.addEventListener('click', () => {
                isWeekView = !isWeekView;
                toggleView.textContent = isWeekView ? '▼' : '▲';
                updateCalendar();
            });

            // Previous week or month
            prevWeek.addEventListener('click', () => {
                if (isWeekView) {
                    currentDate.setDate(currentDate.getDate() - 7);
                } else {
                    currentDate.setMonth(currentDate.getMonth() - 1);
                }
                updateCalendar();
            });

            // Next week or month
            nextWeek.addEventListener('click', () => {
                if (isWeekView) {
                    currentDate.setDate(currentDate.getDate() + 7);
                } else {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
                updateCalendar();
            });

            // Add date-specific exercise
            document.getElementById('add-date-exercise').addEventListener('click', () => {
                const name = document.getElementById('date-exercise-name').value.trim();
                if (name && selectedDate) {
                    const dateKey = selectedDate.toDateString();
                    const exercises = JSON.parse(localStorage.getItem(`exercises_${dateKey}`)) || [];
                    exercises.push({ name, completed: false, reps: 0 });
                    saveDateExercises(exercises);
                    loadDateExercises();
                    document.getElementById('date-exercise-name').value = '';
                }
            });

            updateCalendar();
        }

        // Load calendar on page load
        window.addEventListener('load', () => {
            renderCalendar();
        });