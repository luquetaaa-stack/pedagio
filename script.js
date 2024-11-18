const carForm = document.getElementById('carForm');
const ticketList = document.getElementById('ticketList');
const reportDiv = document.getElementById('report');
const closeShiftButton = document.getElementById('closeShift');

const DISTANCE = 120; // distância em km
const TOLL_VALUE = 20; // valor do pedágio
let cars = [];
let processingStartTime;
let processingEndTime;

carForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const carPlate = document.getElementById('carPlate').value;
    const entryTime = document.getElementById('entryTime').value;
    const exitTime = document.getElementById('exitTime').value;

    const timeSpent = calculateTime(entryTime, exitTime);
    const averageSpeed = calculateAverageSpeed(DISTANCE, timeSpent);
    const tollToPay = calculateToll(averageSpeed);

    const car = {
        plate: carPlate,
        entryTime: entryTime,
        exitTime: exitTime,
        timeSpent: timeSpent,
        averageSpeed: averageSpeed,
        tollToPay: tollToPay
    };

    cars.push(car);
    updateTicketList();
    updateProcessingTimes();
    carForm.reset();
});

function calculateTime(entry, exit) {
    const entryDate = new Date(`1970-01-01T${entry}:00`);
    const exitDate = new Date(`1970-01-01T${exit}:00`);
    return (exitDate - entryDate) / 1000 / 60; // em minutos
}

function calculateAverageSpeed(distance, time) {
    return (distance / (time / 60)); // km/h
}

function calculateToll(speed) {
    let discount = 0;
    if (speed <= 60) {
        discount = 0.15;
    } else if (speed > 60 && speed <= 100) {
        discount = 0.10;
    }
    return TOLL_VALUE * (1 - discount);
}

function updateTicketList() {
    ticketList.innerHTML = '';
    cars.forEach(car => {
        const li = document.createElement('li');
        li.textContent = `Placa: ${car.plate}, Hora Entrada: ${car.entryTime}, Hora Saída: ${car.exitTime}, Tempo: ${car.timeSpent} min, Velocidade Média: ${car.averageSpeed.toFixed(2)} km/h, Valor a Pagar: R$ ${car.tollToPay.toFixed(2)}`;
        ticketList.appendChild(li);
    });
}

function updateProcessingTimes() {
    if (!processingStartTime) {
        processingStartTime = new Date();
    }
    processingEndTime = new Date();
}

closeShiftButton.addEventListener('click', function() {
    generateReport();
    cars = []; // Resetar os dados após fechar o turno
    ticketList.innerHTML = ''; // Limpar a lista de tickets
    reportDiv.innerHTML = ''; // Limpar o relatório
    processingStartTime = null; // Resetar horário de início
    processingEndTime = null; // Resetar horário de fim
});

function generateReport() {
    if (cars.length === 0) {
        alert('Nenhum veículo registrado para gerar relatório.');
        return;
    }

    const speeds = cars.map(car => car.averageSpeed);
    const totalValues = cars.reduce((total, car) => total + car.tollToPay, 0);

    const report = `
        Menor Velocidade: ${Math.min(...speeds).toFixed(2)} km/h
        Maior Velocidade: ${Math.max(...speeds).toFixed(2)} km/h
        Média das Velocidades: ${(speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2)} km/h
        Total dos Valores: R$ ${totalValues.toFixed(2)}
        Hora de Início: ${processingStartTime ? processingStartTime.toLocaleTimeString() : 'N/A'}
        Hora de Fim: ${processingEndTime ? processingEndTime.toLocaleTimeString() : 'N/A'}
    `;

    reportDiv.innerHTML = `<pre>${report}</pre>`;
}
