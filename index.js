const cowinApi = async () => {
    var d = new Date();
    var date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()
    const response = await fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=304&date=' + date)
    const myJson =  await response.json(); //extract JSON from the http response
    return myJson.centers
}

const checkStatus = async () => {
    var cowinData = await cowinApi()
    if (cowinData.length > 0)
    {
        checkAvailability(cowinData)
    }
}

const checkAvailability = async (cowinData) => {
    for ( i=0; i < cowinData.length; i++ )
    {
        sessions = cowinData[i].sessions
        for ( j=0; j < sessions.length; j++ )
        {
            session=sessions[j]
            if (session.min_age_limit === 18 && session.available_capacity_dose1 === 0)
            {
                message = "Hi, Vaccine slot available at " + cowinData[i].name + " on " + session.date + ". The address of the location is " + cowinData[i].address
                url = 'https://api.telegram.org/bot1886526038:AAH2eZ8EgSeBcyvwYBKYDzq_Jhryo48ZSe0/sendMessage?chat_id=@slotAlertlocalktm&text=' + encodeURIComponent(message)
                await sendtoTelegram()
            }
        }
    }
}
async function sendtoTelegram () 
{
    const response = await fetch( url , {
      method: 'post',
    });
    return response
}

const looper = async () => {
    await checkStatus()
    setTimeout(looper , 10000)
}
window.onload = function() {
    looper()
}