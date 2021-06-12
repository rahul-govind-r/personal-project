const reply = async () => {
    var d = new Date();
    var date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()
    const response = await fetch('https://api.telegram.org/bot1886526038:AAH2eZ8EgSeBcyvwYBKYDzq_Jhryo48ZSe0/getUpdates')
    const myJson =  await response.json(); //extract JSON from the http response
    return myJson.result
}

const sendMsg = async () => {
    data = await reply()
    for (i = 0 ; i < data.length ; i++)
    {
        userDetail = data[i]
        var distObj = [
            {district_id: 301, district_name: "Alappuzha"},
            {district_id: 307, district_name: "Ernakulam"},
            {district_id: 306, district_name: "Idukki"},
            {district_id: 297, district_name: "Kannur"},
            {district_id: 295, district_name: "Kasaragod"},
            {district_id: 298, district_name: "Kollam"},
            {district_id: 304, district_name: "Kottayam"},
            {district_id: 305, district_name: "Kozhikode"},
            {district_id: 302, district_name: "Malappuram"},
            {district_id: 308, district_name: "Palakkad"},
            {district_id: 300, district_name: "Pathanamthitta"},
            {district_id: 296, district_name: "Thiruvananthapuram"},
            {district_id: 303, district_name: "Thrissur"},
            {district_id: 299, district_name: "Wayanad"}
        ]
        for (j =0 ; j< distObj.length ; j++)
        {
        if (distObj[j].district_name === userDetail.message.text)
        {
            var distId = distObj[j].district_id
            var userId = userDetail.message.chat.id
            var cowinData = await cowinApi(distId)
            if (cowinData.length > 0)
            {
                checkAvailability(cowinData, userId)
            }
        }
        }

    } 
}

const cowinApi = async (distId) => {
    var d = new Date();
    var date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()
    const response = await fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+ distId +'&date=' + date)
    const myJson =  await response.json(); //extract JSON from the http response
    if (response.status !== 200) 
    {
        message = "Error code " + response.status + " : API FAILED"
        url = 'https://api.telegram.org/bot1886526038:AAH2eZ8EgSeBcyvwYBKYDzq_Jhryo48ZSe0/sendMessage?chat_id=616911342&text=' + encodeURIComponent(message)
        await sendtoTelegram()
        window.location.reload()
    }
    return myJson.centers
}

const checkAvailability = async (cowinData, userId) => {
    for ( i=0; i < cowinData.length; i++ )
    {
        sessions = cowinData[i].sessions
        for ( j=0; j < sessions.length; j++ )
        {
            vaccine_type = cowinData[i].fee_type
            session=sessions[j]
            if (session.min_age_limit === 18 && session.available_capacity_dose1 !== 0)
            {
                message = `${cowinData[i].district_name}

Vaccine : ${session.vaccine}

Age Group : ${session.min_age_limit}

Center Name: ${cowinData[i].name}

Date: ${session.date}

Dose 1 Available capacity : ${session.available_capacity_dose1}

Fee-type: ${cowinData[i].fee_type}`

                url = 'https://api.telegram.org/bot1886526038:AAH2eZ8EgSeBcyvwYBKYDzq_Jhryo48ZSe0/sendMessage?chat_id=' + userId + '&text=' + encodeURIComponent(message)
                
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
    await sendMsg()
    setTimeout(looper , 10000)
}
window.onload = function() {
    looper()
    looperTVM()
    looperKOC()
}