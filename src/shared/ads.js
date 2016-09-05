import _ from 'lodash';
const items = [
    {
        id : 'http://s.click.aliexpress.com/e/23ZvJU7AE?bz=300*250',
        src : 'http://ae01.alicdn.com/kf/HTB1e6WTHVXXXXcpXFXXq6xXFXXXQ/300x250.jpg',
        width : '300px',
        height : '250px',
	    locale: 'EN'
    },
    {
        id : 'http://s.click.aliexpress.com/e/2z7iMrrzr',
        src : 'http://ae01.alicdn.com/kf/HTB14jyXHpXXXXchaXXXq6xXFXXXd/300x250.jpg',
	    width : '300px',
	    height : '250px',
	    locale: 'RU'
    },
    {
        id : 'http://s.click.aliexpress.com/e/y7yByRrZr?bz=300*250',
        src : 'http://ae01.alicdn.com/kf/HTB1xHegHpXXXXXlXVXXq6xXFXXXA/300x250.jpg',
	    width : '300px',
	    height : '250px',
	    locale: 'PT_BR'
    },
]

module.exports = getByLocale;

function getByLocale(){
	var currentLocale = chrome.i18n.getMessage('lang');
	var ads = _.find(items, function(i) { return i.locale.toUpperCase() === currentLocale.toLowerCase()});
	return ads || items[0];
}