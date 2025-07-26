//Calendar Functionality
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
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function updateCalendar() {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        weekYear.textContent = `${months[currentMonth]} ${currentYear}`;

        calendarDays.innerHTML = '';

        if (isWeekView) {
            //Weekview: Show Sunday to Saturday
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
            //MonthView: Show all days in the month
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            const startDay = firstDay.getDay();
            const totalDays = lastDay.getDate();
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
    }
    updateCalendar();
}
