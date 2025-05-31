const zodiacData = [
    { name: 'Aries', dates: 'March 21 - April 19', description: 'The Ram - Fire sign, ruled by Mars' },
    { name: 'Taurus', dates: 'April 20 - May 20', description: 'The Bull - Earth sign, ruled by Venus' },
    { name: 'Gemini', dates: 'May 21 - June 20', description: 'The Twins - Air sign, ruled by Mercury' },
    { name: 'Cancer', dates: 'June 21 - July 22', description: 'The Crab - Water sign, ruled by the Moon' },
    { name: 'Leo', dates: 'July 23 - August 22', description: 'The Lion - Fire sign, ruled by the Sun' },
    { name: 'Virgo', dates: 'August 23 - September 22', description: 'The Virgin - Earth sign, ruled by Mercury' },
    { name: 'Libra', dates: 'September 23 - October 22', description: 'The Scales - Air sign, ruled by Venus' },
    { name: 'Scorpio', dates: 'October 23 - November 21', description: 'The Scorpion - Water sign, ruled by Pluto' },
    { name: 'Sagittarius', dates: 'November 22 - December 21', description: 'The Archer - Fire sign, ruled by Jupiter' },
    { name: 'Capricorn', dates: 'December 22 - January 19', description: 'The Goat - Earth sign, ruled by Saturn' },
    { name: 'Aquarius', dates: 'January 20 - February 18', description: 'The Water Bearer - Air sign, ruled by Uranus' },
    { name: 'Pisces', dates: 'February 19 - March 20', description: 'The Fish - Water sign, ruled by Neptune' }
];

async function getHoroscope(sign) {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign.toLowerCase()}&day=TODAY`)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching horoscope:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('sun-sign-select');
    const descriptionElement = document.getElementById('sign-description');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Populate select options
    zodiacData.forEach(sign => {
        const option = document.createElement('option');
        option.value = sign.name.toLowerCase();
        option.textContent = `${sign.name} (${sign.dates})`;
        selectElement.appendChild(option);
    });

    // Add event listener for selection change
    selectElement.addEventListener('change', async (event) => {
        const selectedSign = event.target.value;
        if (!selectedSign) {
            descriptionElement.style.display = 'none';
            return;
        }

        const selectedData = zodiacData.find(sign => sign.name.toLowerCase() === selectedSign);
        if (selectedData) {
            loadingSpinner.style.display = 'block';
            descriptionElement.style.display = 'none';

            const horoscope = await getHoroscope(selectedSign);
            loadingSpinner.style.display = 'none';
            
            if (horoscope && horoscope.contents) {
                const horoscopeData = JSON.parse(horoscope.contents);
                const content = `
                    <h2>${selectedData.name}</h2>
                    <p class="sign-info">${selectedData.description}</p>
                    <div class="horoscope-details">
                        <h3>Daily Horoscope</h3>
                        <p>${horoscopeData.data.horoscope_data}</p>
                    </div>
                `;
                descriptionElement.innerHTML = content;
                descriptionElement.style.display = 'block';
            } else {
                descriptionElement.innerHTML = `
                    <h2>${selectedData.name}</h2>
                    <p class="sign-info">${selectedData.description}</p>
                    <p class="error-message">Unable to fetch horoscope at the moment. Please try again later.</p>
                `;
                descriptionElement.style.display = 'block';
            }
        }
    });
});