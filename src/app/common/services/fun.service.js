/**
 * Created by Otherplayer on 2017/1/9.
 */
(function() {
    'use strict';

    /**
     * 删除弹出框tip: delmodaltip
     *
     */
    angular
        .module('airs')
        .filter('capitalize', capitalize);

    /** @ngInject */
    function capitalize() {
        return function(input){        //input是我们传入的字符串
            if (input) {
                return input[0].toUpperCase() + input.slice(1);
            }
        };
    };


    angular
        .module('airs')
        .filter('descTime', descTime);

        /** @ngInject */
    function descTime() {

        return service;


        function service(input) {

            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;

            var date = new Date(input);
            var now = new Date().getTime();
            var bef = date.getTime();

            var diffValue = now - bef;
            var monthC =diffValue/month;
            var weekC =diffValue/(7*day);
            var dayC =diffValue/day;
            var hourC =diffValue/hour;
            var minC =diffValue/minute;
            var result = '';
            if(monthC>=1){
                // result = parseInt(monthC) + "个月前";
                return (date.getFullYear()+"/"+date.getMonth()+1)+"/"+date.getDate();
            }
            else if(weekC>=1){
                result = parseInt(weekC) + "周前";
            }
            else if(dayC>=1){
                result =parseInt(dayC) +"天前";
            }
            else if(hourC>=1){
                result =parseInt(hourC) +"个小时前";
            }
            else if(minC>=1){
                result = parseInt(minC) +"分钟前";
            }else
                result = "刚刚";

            return result;
        }

    };






    /**
     * 字符串转换为数字
     *
     */
    angular
        .module('airs')
        .filter('num', num);

    /** @ngInject */
    function num() {
        return function(input){        //input是我们传入的字符串
            if (input) {
                return Number(input);
            }
        };
    };


    angular
        .module('airs')
        .factory('iotUtil', iotUtil);

    /** @ngInject */
    function iotUtil(StorageService) {
        var service = {
            uuid : uuid,
            isNull : isNull,
            pagesize : pagesize,
            htmlToPlaintext : htmlToPlaintext,
            getKeyValueFromURL : getKeyValueFromURL
        };
        return service;

        ////////////////////

        function uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "";

            var uuid = s.join("");
            return uuid;
        }
        function isNull( str ) {
            if ( !str || str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        }
        function pagesize() {
            var hnaInfo = 'airspc.information';
            var infomation = StorageService.get(hnaInfo);
            var pageSizeKey = 'airspc.pagesize.' + infomation.username;
            var tempPageSize = StorageService.get(pageSizeKey);
            if (tempPageSize && tempPageSize != 'undefined'){
                return tempPageSize;
            }
            return 10;
        }
        function htmlToPlaintext(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }
        function getKeyValueFromURL(key,urlstring) {
            var tempData = urlstring.split(key + '=');
            if (tempData.length == 1){
                return 'undefined';
            }
            var lastPath = tempData.pop();
            tempData = lastPath.split('&');
            var result = tempData[0];
            return result;
        }
    }


    angular
        .module('airs')
        .factory('deepcopy', deepcopy);

    /** @ngInject */
    function deepcopy() {
        var service = {
            copy : copy
        };
        return service;

        ////////////////////

        function copy(source) {
            var result={};
            for (var key in source) {
                result[key] = typeof source[key]==='object'? copy(source[key]): source[key];
            }
            return result;
        }
    }


    /**
     * 过滤器:国际化
     *
     */
    angular
        .module('airs')
        .filter("T", T);

    /** @ngInject */
    function T($translate) {
        return function(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        };
    }


    /**
     * 服务:国际化
     *
     */
    angular
        .module('airs')
        .factory("i18n", i18n);

    /** @ngInject */
    function i18n($translate) {
        var service = {
            t: translate,
            value : translate
        };
        return service;

        ////////////////////

        function translate(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        }
    }


    /**
     * 日志:logger
     *
     */
    angular
        .module('airs')
        .factory('logger', logger);

    /** @ngInject */
    function logger(constdata) {

        var mod = {
            log: 1,
            debug: 2,
            info: 4,
            warn: 8,
            error: 16
        };
        var debugMode = constdata.debugMode;
        var logLevel = parseInt(constdata.logLevel, 2);


        var service = {
            log: log,
            err: err,
            error: err,
            warn: warn,
            info: info,
            debug: debug
        };

        return service;


        ///////////////////


        function log(args) {
            if (__showLevel('log')) {
                console.log(args);
            }
        }

        function err(args) {
            if (__showLevel('error')) {
                console.error(args);
            }
        }

        function warn(args) {
            if (__showLevel('warn')) {
                console.warn(args);
            }
        }

        function info(args) {
            if (__showLevel('info')) {
                console.info(args);
            }
        }

        function debug(args) {
            if (__showLevel('debug')) {
                console.log(args);
            }
        }

        function __showLevel(name) {
            var isValid = logLevel & mod[name];
            return debugMode && isValid;
        }
    }


    /**
     * 匹配:matcher
     *
     */
    angular
        .module('airs')
        .factory('matcher', matcher);

    /** @ngInject */
    function matcher(logger) {

        var service = {
            template: templateDistillParameters,
            exact: exactDistillParameters,
            split:sliceParameters,
            isValidName:isValidName
        };

        return service;

        ///////////////////

        function templateDistillParameters(text) {//匹配以‘@’开始,‘ ’结尾,中间包含‘:’,‘:’前后都不为空的字符串
            var reg=/((@[\w-]+.[\w-]+):(\w+))/g;
            // logger.debug(text);
            if (text != 'undefined' && text){
                return text.match(reg);
            }
            return null;
        }
        function exactDistillParameters(text) {//匹配以‘@’开始,‘ ’结尾,中间包含‘:’,‘:’前后都不为空的字符串
            var reg=/(@[\w-]+\.?[\w-]+):([\w-]+)(`.*?`)?/g;
            // logger.debug(text);
            if (text != 'undefined' && text){
                return text.match(reg);
            }
            return null;
        }
        function sliceParameters(args,char) {
            if (args &&  args != 'undefined' && args.length > 0){
                var results = [];
                for(var i = 0; i < args.length; i++){
                    var temp = args[i].split(char);
                    results.push({meta:temp[0],alias:temp[1],text:'-'});
                }
                return results;
            }
        }
        function isValidName(args) {
            if(args && args.length > 0){
                var reg=/^[a-zA-Z][a-zA-Z0-9_-]{1,49}$/;
                if(reg.test(args)){
                    return true;
                }
            }
            return false;
        }

    }



    angular
        .module('airs')
        .factory('delmodaltip', delmodaltip);

    /** @ngInject */
    function delmodaltip(i18n) {
        var tip = {
            title: i18n.t('u.DELETE'),
            content: i18n.t('u.DELETE_CONFIRM')
        };

        return tip;
    }

    /**
     * 时区:TimezoneServer
     *
     */
    angular
        .module('airs')
        .factory('TimezoneServer', TimezoneServer);

    /** @ngInject */
    function TimezoneServer() {

        var service = {
            zones: zones
        };

        return service;

        ///////////////////

        function zones() {
            var timezones = [
                {
                    "value": "Africa/Abidjan",
                    "title": "Africa/Abidjan (GMT)"
                },
                {
                    "value": "Africa/Accra",
                    "title": "Africa/Accra (GMT)"
                },
                {
                    "value": "Africa/Addis_Ababa",
                    "title": "Africa/Addis_Ababa (GMT+3)"
                },
                {
                    "value": "Africa/Algiers",
                    "title": "Africa/Algiers (GMT+1)"
                },
                {
                    "value": "Africa/Asmara",
                    "title": "Africa/Asmara (GMT+3)"
                },
                {
                    "value": "Africa/Bamako",
                    "title": "Africa/Bamako (GMT)"
                },
                {
                    "value": "Africa/Bangui",
                    "title": "Africa/Bangui (GMT+1)"
                },
                {
                    "value": "Africa/Banjul",
                    "title": "Africa/Banjul (GMT)"
                },
                {
                    "value": "Africa/Bissau",
                    "title": "Africa/Bissau (GMT)"
                },
                {
                    "value": "Africa/Blantyre",
                    "title": "Africa/Blantyre (GMT+2)"
                },
                {
                    "value": "Africa/Brazzaville",
                    "title": "Africa/Brazzaville (GMT+1)"
                },
                {
                    "value": "Africa/Bujumbura",
                    "title": "Africa/Bujumbura (GMT+2)"
                },
                {
                    "value": "Africa/Cairo",
                    "title": "Africa/Cairo (GMT+2)"
                },
                {
                    "value": "Africa/Casablanca",
                    "title": "Africa/Casablanca (GMT)"
                },
                {
                    "value": "Africa/Ceuta",
                    "title": "Africa/Ceuta (GMT+1)"
                },
                {
                    "value": "Africa/Conakry",
                    "title": "Africa/Conakry (GMT)"
                },
                {
                    "value": "Africa/Dakar",
                    "title": "Africa/Dakar (GMT)"
                },
                {
                    "value": "Africa/Dar_es_Salaam",
                    "title": "Africa/Dar_es_Salaam (GMT+3)"
                },
                {
                    "value": "Africa/Djibouti",
                    "title": "Africa/Djibouti (GMT+3)"
                },
                {
                    "value": "Africa/Douala",
                    "title": "Africa/Douala (GMT+1)"
                },
                {
                    "value": "Africa/El_Aaiun",
                    "title": "Africa/El_Aaiun (GMT)"
                },
                {
                    "value": "Africa/Freetown",
                    "title": "Africa/Freetown (GMT)"
                },
                {
                    "value": "Africa/Gaborone",
                    "title": "Africa/Gaborone (GMT+2)"
                },
                {
                    "value": "Africa/Harare",
                    "title": "Africa/Harare (GMT+2)"
                },
                {
                    "value": "Africa/Johannesburg",
                    "title": "Africa/Johannesburg (GMT+2)"
                },
                {
                    "value": "Africa/Juba",
                    "title": "Africa/Juba (GMT+3)"
                },
                {
                    "value": "Africa/Kampala",
                    "title": "Africa/Kampala (GMT+3)"
                },
                {
                    "value": "Africa/Khartoum",
                    "title": "Africa/Khartoum (GMT+3)"
                },
                {
                    "value": "Africa/Kigali",
                    "title": "Africa/Kigali (GMT+2)"
                },
                {
                    "value": "Africa/Kinshasa",
                    "title": "Africa/Kinshasa (GMT+1)"
                },
                {
                    "value": "Africa/Lagos",
                    "title": "Africa/Lagos (GMT+1)"
                },
                {
                    "value": "Africa/Libreville",
                    "title": "Africa/Libreville (GMT+1)"
                },
                {
                    "value": "Africa/Lome",
                    "title": "Africa/Lome (GMT)"
                },
                {
                    "value": "Africa/Luanda",
                    "title": "Africa/Luanda (GMT+1)"
                },
                {
                    "value": "Africa/Lubumbashi",
                    "title": "Africa/Lubumbashi (GMT+2)"
                },
                {
                    "value": "Africa/Lusaka",
                    "title": "Africa/Lusaka (GMT+2)"
                },
                {
                    "value": "Africa/Malabo",
                    "title": "Africa/Malabo (GMT+1)"
                },
                {
                    "value": "Africa/Maputo",
                    "title": "Africa/Maputo (GMT+2)"
                },
                {
                    "value": "Africa/Maseru",
                    "title": "Africa/Maseru (GMT+2)"
                },
                {
                    "value": "Africa/Mbabane",
                    "title": "Africa/Mbabane (GMT+2)"
                },
                {
                    "value": "Africa/Mogadishu",
                    "title": "Africa/Mogadishu (GMT+3)"
                },
                {
                    "value": "Africa/Monrovia",
                    "title": "Africa/Monrovia (GMT)"
                },
                {
                    "value": "Africa/Nairobi",
                    "title": "Africa/Nairobi (GMT+3)"
                },
                {
                    "value": "Africa/Ndjamena",
                    "title": "Africa/Ndjamena (GMT+1)"
                },
                {
                    "value": "Africa/Niamey",
                    "title": "Africa/Niamey (GMT+1)"
                },
                {
                    "value": "Africa/Nouakchott",
                    "title": "Africa/Nouakchott (GMT)"
                },
                {
                    "value": "Africa/Ouagadougou",
                    "title": "Africa/Ouagadougou (GMT)"
                },
                {
                    "value": "Africa/Porto-Novo",
                    "title": "Africa/Porto-Novo (GMT+1)"
                },
                {
                    "value": "Africa/Sao_Tome",
                    "title": "Africa/Sao_Tome (GMT)"
                },
                {
                    "value": "Africa/Tripoli",
                    "title": "Africa/Tripoli (GMT+2)"
                },
                {
                    "value": "Africa/Tunis",
                    "title": "Africa/Tunis (GMT+1)"
                },
                {
                    "value": "Africa/Windhoek",
                    "title": "Africa/Windhoek (GMT+2)"
                },
                {
                    "value": "America/Adak",
                    "title": "America/Adak (HAST)"
                },
                {
                    "value": "America/Anchorage",
                    "title": "America/Anchorage (AKST)"
                },
                {
                    "value": "America/Anguilla",
                    "title": "America/Anguilla (AST)"
                },
                {
                    "value": "America/Antigua",
                    "title": "America/Antigua (AST)"
                },
                {
                    "value": "America/Araguaina",
                    "title": "America/Araguaina (GMT-3)"
                },
                {
                    "value": "America/Argentina/Buenos_Aires",
                    "title": "America/Argentina/Buenos_Aires (GMT-3)"
                },
                {
                    "value": "America/Argentina/Catamarca",
                    "title": "America/Argentina/Catamarca (GMT-3)"
                },
                {
                    "value": "America/Argentina/Cordoba",
                    "title": "America/Argentina/Cordoba (GMT-3)"
                },
                {
                    "value": "America/Argentina/Jujuy",
                    "title": "America/Argentina/Jujuy (GMT-3)"
                },
                {
                    "value": "America/Argentina/La_Rioja",
                    "title": "America/Argentina/La_Rioja (GMT-3)"
                },
                {
                    "value": "America/Argentina/Mendoza",
                    "title": "America/Argentina/Mendoza (GMT-3)"
                },
                {
                    "value": "America/Argentina/Rio_Gallegos",
                    "title": "America/Argentina/Rio_Gallegos (GMT-3)"
                },
                {
                    "value": "America/Argentina/Salta",
                    "title": "America/Argentina/Salta (GMT-3)"
                },
                {
                    "value": "America/Argentina/San_Juan",
                    "title": "America/Argentina/San_Juan (GMT-3)"
                },
                {
                    "value": "America/Argentina/San_Luis",
                    "title": "America/Argentina/San_Luis (GMT-3)"
                },
                {
                    "value": "America/Argentina/Tucuman",
                    "title": "America/Argentina/Tucuman (GMT-3)"
                },
                {
                    "value": "America/Argentina/Ushuaia",
                    "title": "America/Argentina/Ushuaia (GMT-3)"
                },
                {
                    "value": "America/Aruba",
                    "title": "America/Aruba (AST)"
                },
                {
                    "value": "America/Asuncion",
                    "title": "America/Asuncion (GMT-3)"
                },
                {
                    "value": "America/Atikokan",
                    "title": "America/Atikokan (EST)"
                },
                {
                    "value": "America/Bahia",
                    "title": "America/Bahia (GMT-3)"
                },
                {
                    "value": "America/Bahia_Banderas",
                    "title": "America/Bahia_Banderas (CST)"
                },
                {
                    "value": "America/Barbados",
                    "title": "America/Barbados (AST)"
                },
                {
                    "value": "America/Belem",
                    "title": "America/Belem (GMT-3)"
                },
                {
                    "value": "America/Belize",
                    "title": "America/Belize (CST)"
                },
                {
                    "value": "America/Blanc-Sablon",
                    "title": "America/Blanc-Sablon (AST)"
                },
                {
                    "value": "America/Boa_Vista",
                    "title": "America/Boa_Vista (GMT-4)"
                },
                {
                    "value": "America/Bogota",
                    "title": "America/Bogota (GMT-5)"
                },
                {
                    "value": "America/Boise",
                    "title": "America/Boise (MST)"
                },
                {
                    "value": "America/Cambridge_Bay",
                    "title": "America/Cambridge_Bay (MST)"
                },
                {
                    "value": "America/Campo_Grande",
                    "title": "America/Campo_Grande (GMT-3)"
                },
                {
                    "value": "America/Cancun",
                    "title": "America/Cancun (EST)"
                },
                {
                    "value": "America/Caracas",
                    "title": "America/Caracas (GMT-4)"
                },
                {
                    "value": "America/Cayenne",
                    "title": "America/Cayenne (GMT-3)"
                },
                {
                    "value": "America/Cayman",
                    "title": "America/Cayman (EST)"
                },
                {
                    "value": "America/Chicago",
                    "title": "America/Chicago (CST)"
                },
                {
                    "value": "America/Chihuahua",
                    "title": "America/Chihuahua (GMT-7)"
                },
                {
                    "value": "America/Costa_Rica",
                    "title": "America/Costa_Rica (CST)"
                },
                {
                    "value": "America/Creston",
                    "title": "America/Creston (MST)"
                },
                {
                    "value": "America/Cuiaba",
                    "title": "America/Cuiaba (GMT-3)"
                },
                {
                    "value": "America/Curacao",
                    "title": "America/Curacao (AST)"
                },
                {
                    "value": "America/Danmarkshavn",
                    "title": "America/Danmarkshavn (GMT)"
                },
                {
                    "value": "America/Dawson",
                    "title": "America/Dawson (PST)"
                },
                {
                    "value": "America/Dawson_Creek",
                    "title": "America/Dawson_Creek (MST)"
                },
                {
                    "value": "America/Denver",
                    "title": "America/Denver (MST)"
                },
                {
                    "value": "America/Detroit",
                    "title": "America/Detroit (EST)"
                },
                {
                    "value": "America/Dominica",
                    "title": "America/Dominica (AST)"
                },
                {
                    "value": "America/Edmonton",
                    "title": "America/Edmonton (MST)"
                },
                {
                    "value": "America/Eirunepe",
                    "title": "America/Eirunepe (GMT-5)"
                },
                {
                    "value": "America/El_Salvador",
                    "title": "America/El_Salvador (CST)"
                },
                {
                    "value": "America/Fort_Nelson",
                    "title": "America/Fort_Nelson (MST)"
                },
                {
                    "value": "America/Fortaleza",
                    "title": "America/Fortaleza (GMT-3)"
                },
                {
                    "value": "America/Glace_Bay",
                    "title": "America/Glace_Bay (AST)"
                },
                {
                    "value": "America/Godthab",
                    "title": "America/Godthab (GMT-3)"
                },
                {
                    "value": "America/Goose_Bay",
                    "title": "America/Goose_Bay (AST)"
                },
                {
                    "value": "America/Grand_Turk",
                    "title": "America/Grand_Turk (AST)"
                },
                {
                    "value": "America/Grenada",
                    "title": "America/Grenada (AST)"
                },
                {
                    "value": "America/Guadeloupe",
                    "title": "America/Guadeloupe (AST)"
                },
                {
                    "value": "America/Guatemala",
                    "title": "America/Guatemala (CST)"
                },
                {
                    "value": "America/Guayaquil",
                    "title": "America/Guayaquil (GMT-5)"
                },
                {
                    "value": "America/Guyana",
                    "title": "America/Guyana (GMT-4)"
                },
                {
                    "value": "America/Halifax",
                    "title": "America/Halifax (AST)"
                },
                {
                    "value": "America/Havana",
                    "title": "America/Havana (GMT-5)"
                },
                {
                    "value": "America/Hermosillo",
                    "title": "America/Hermosillo (GMT-7)"
                },
                {
                    "value": "America/Indiana/Indianapolis",
                    "title": "America/Indiana/Indianapolis (EST)"
                },
                {
                    "value": "America/Indiana/Knox",
                    "title": "America/Indiana/Knox (CST)"
                },
                {
                    "value": "America/Indiana/Marengo",
                    "title": "America/Indiana/Marengo (EST)"
                },
                {
                    "value": "America/Indiana/Petersburg",
                    "title": "America/Indiana/Petersburg (EST)"
                },
                {
                    "value": "America/Indiana/Tell_City",
                    "title": "America/Indiana/Tell_City (CST)"
                },
                {
                    "value": "America/Indiana/Vevay",
                    "title": "America/Indiana/Vevay (EST)"
                },
                {
                    "value": "America/Indiana/Vincennes",
                    "title": "America/Indiana/Vincennes (EST)"
                },
                {
                    "value": "America/Indiana/Winamac",
                    "title": "America/Indiana/Winamac (EST)"
                },
                {
                    "value": "America/Inuvik",
                    "title": "America/Inuvik (MST)"
                },
                {
                    "value": "America/Iqaluit",
                    "title": "America/Iqaluit (EST)"
                },
                {
                    "value": "America/Jamaica",
                    "title": "America/Jamaica (EST)"
                },
                {
                    "value": "America/Juneau",
                    "title": "America/Juneau (AKST)"
                },
                {
                    "value": "America/Kentucky/Louisville",
                    "title": "America/Kentucky/Louisville (EST)"
                },
                {
                    "value": "America/Kentucky/Monticello",
                    "title": "America/Kentucky/Monticello (EST)"
                },
                {
                    "value": "America/Kralendijk",
                    "title": "America/Kralendijk (AST)"
                },
                {
                    "value": "America/La_Paz",
                    "title": "America/La_Paz (GMT-4)"
                },
                {
                    "value": "America/Lima",
                    "title": "America/Lima (GMT-5)"
                },
                {
                    "value": "America/Los_Angeles",
                    "title": "America/Los_Angeles (PST)"
                },
                {
                    "value": "America/Lower_Princes",
                    "title": "America/Lower_Princes (AST)"
                },
                {
                    "value": "America/Maceio",
                    "title": "America/Maceio (GMT-3)"
                },
                {
                    "value": "America/Managua",
                    "title": "America/Managua (CST)"
                },
                {
                    "value": "America/Manaus",
                    "title": "America/Manaus (GMT-4)"
                },
                {
                    "value": "America/Marigot",
                    "title": "America/Marigot (AST)"
                },
                {
                    "value": "America/Martinique",
                    "title": "America/Martinique (AST)"
                },
                {
                    "value": "America/Matamoros",
                    "title": "America/Matamoros (CST)"
                },
                {
                    "value": "America/Mazatlan",
                    "title": "America/Mazatlan (GMT-7)"
                },
                {
                    "value": "America/Menominee",
                    "title": "America/Menominee (CST)"
                },
                {
                    "value": "America/Merida",
                    "title": "America/Merida (CST)"
                },
                {
                    "value": "America/Metlakatla",
                    "title": "America/Metlakatla (AKST)"
                },
                {
                    "value": "America/Mexico_City",
                    "title": "America/Mexico_City (CST)"
                },
                {
                    "value": "America/Miquelon",
                    "title": "America/Miquelon (GMT-3)"
                },
                {
                    "value": "America/Moncton",
                    "title": "America/Moncton (AST)"
                },
                {
                    "value": "America/Monterrey",
                    "title": "America/Monterrey (CST)"
                },
                {
                    "value": "America/Montevideo",
                    "title": "America/Montevideo (GMT-3)"
                },
                {
                    "value": "America/Montreal",
                    "title": "America/Montreal (GMT-5)"
                },
                {
                    "value": "America/Montserrat",
                    "title": "America/Montserrat (AST)"
                },
                {
                    "value": "America/Nassau",
                    "title": "America/Nassau (EST)"
                },
                {
                    "value": "America/New_York",
                    "title": "America/New_York (EST)"
                },
                {
                    "value": "America/Nipigon",
                    "title": "America/Nipigon (EST)"
                },
                {
                    "value": "America/Nome",
                    "title": "America/Nome (AKST)"
                },
                {
                    "value": "America/Noronha",
                    "title": "America/Noronha (GMT-2)"
                },
                {
                    "value": "America/North_Dakota/Beulah",
                    "title": "America/North_Dakota/Beulah (CST)"
                },
                {
                    "value": "America/North_Dakota/Center",
                    "title": "America/North_Dakota/Center (CST)"
                },
                {
                    "value": "America/North_Dakota/New_Salem",
                    "title": "America/North_Dakota/New_Salem (CST)"
                },
                {
                    "value": "America/Ojinaga",
                    "title": "America/Ojinaga (MST)"
                },
                {
                    "value": "America/Panama",
                    "title": "America/Panama (EST)"
                },
                {
                    "value": "America/Pangnirtung",
                    "title": "America/Pangnirtung (EST)"
                },
                {
                    "value": "America/Paramaribo",
                    "title": "America/Paramaribo (GMT-3)"
                },
                {
                    "value": "America/Phoenix",
                    "title": "America/Phoenix (MST)"
                },
                {
                    "value": "America/Port-au-Prince",
                    "title": "America/Port-au-Prince (EST)"
                },
                {
                    "value": "America/Port_of_Spain",
                    "title": "America/Port_of_Spain (AST)"
                },
                {
                    "value": "America/Porto_Velho",
                    "title": "America/Porto_Velho (GMT-4)"
                },
                {
                    "value": "America/Puerto_Rico",
                    "title": "America/Puerto_Rico (AST)"
                },
                {
                    "value": "America/Rainy_River",
                    "title": "America/Rainy_River (CST)"
                },
                {
                    "value": "America/Rankin_Inlet",
                    "title": "America/Rankin_Inlet (CST)"
                },
                {
                    "value": "America/Recife",
                    "title": "America/Recife (GMT-3)"
                },
                {
                    "value": "America/Regina",
                    "title": "America/Regina (CST)"
                },
                {
                    "value": "America/Resolute",
                    "title": "America/Resolute (CST)"
                },
                {
                    "value": "America/Rio_Branco",
                    "title": "America/Rio_Branco (GMT-5)"
                },
                {
                    "value": "America/Santa_Isabel",
                    "title": "America/Santa_Isabel (GMT-8)"
                },
                {
                    "value": "America/Santarem",
                    "title": "America/Santarem (GMT-3)"
                },
                {
                    "value": "America/Santiago",
                    "title": "America/Santiago (GMT-3)"
                },
                {
                    "value": "America/Santo_Domingo",
                    "title": "America/Santo_Domingo (AST)"
                },
                {
                    "value": "America/Sao_Paulo",
                    "title": "America/Sao_Paulo (GMT-2)"
                },
                {
                    "value": "America/Scoresbysund",
                    "title": "America/Scoresbysund (GMT-1)"
                },
                {
                    "value": "America/Shiprock",
                    "title": "America/Shiprock (MST)"
                },
                {
                    "value": "America/Sitka",
                    "title": "America/Sitka (AKST)"
                },
                {
                    "value": "America/St_Barthelemy",
                    "title": "America/St_Barthelemy (AST)"
                },
                {
                    "value": "America/St_Johns",
                    "title": "America/St_Johns (GMT-3:30)"
                },
                {
                    "value": "America/St_Kitts",
                    "title": "America/St_Kitts (AST)"
                },
                {
                    "value": "America/St_Lucia",
                    "title": "America/St_Lucia (AST)"
                },
                {
                    "value": "America/St_Thomas",
                    "title": "America/St_Thomas (AST)"
                },
                {
                    "value": "America/St_Vincent",
                    "title": "America/St_Vincent (AST)"
                },
                {
                    "value": "America/Swift_Current",
                    "title": "America/Swift_Current (CST)"
                },
                {
                    "value": "America/Tegucigalpa",
                    "title": "America/Tegucigalpa (CST)"
                },
                {
                    "value": "America/Thule",
                    "title": "America/Thule (AST)"
                },
                {
                    "value": "America/Thunder_Bay",
                    "title": "America/Thunder_Bay (EST)"
                },
                {
                    "value": "America/Tijuana",
                    "title": "America/Tijuana (PST)"
                },
                {
                    "value": "America/Toronto",
                    "title": "America/Toronto (EST)"
                },
                {
                    "value": "America/Tortola",
                    "title": "America/Tortola (AST)"
                },
                {
                    "value": "America/Vancouver",
                    "title": "America/Vancouver (PST)"
                },
                {
                    "value": "America/Whitehorse",
                    "title": "America/Whitehorse (PST)"
                },
                {
                    "value": "America/Winnipeg",
                    "title": "America/Winnipeg (CST)"
                },
                {
                    "value": "America/Yakutat",
                    "title": "America/Yakutat (AKST)"
                },
                {
                    "value": "America/Yellowknife",
                    "title": "America/Yellowknife (MST)"
                },
                {
                    "value": "Antarctica/Casey",
                    "title": "Antarctica/Casey (GMT+8)"
                },
                {
                    "value": "Antarctica/Davis",
                    "title": "Antarctica/Davis (GMT+7)"
                },
                {
                    "value": "Antarctica/DumontDUrville",
                    "title": "Antarctica/DumontDUrville (GMT+10)"
                },
                {
                    "value": "Antarctica/Macquarie",
                    "title": "Antarctica/Macquarie (GMT+11)"
                },
                {
                    "value": "Antarctica/Mawson",
                    "title": "Antarctica/Mawson (GMT+5)"
                },
                {
                    "value": "Antarctica/McMurdo",
                    "title": "Antarctica/McMurdo (GMT+13)"
                },
                {
                    "value": "Antarctica/Palmer",
                    "title": "Antarctica/Palmer (GMT-3)"
                },
                {
                    "value": "Antarctica/Rothera",
                    "title": "Antarctica/Rothera (GMT-3)"
                },
                {
                    "value": "Antarctica/South_Pole",
                    "title": "Antarctica/South_Pole (GMT+13)"
                },
                {
                    "value": "Antarctica/Syowa",
                    "title": "Antarctica/Syowa (GMT+3)"
                },
                {
                    "value": "Antarctica/Troll",
                    "title": "Antarctica/Troll (GMT)"
                },
                {
                    "value": "Antarctica/Vostok",
                    "title": "Antarctica/Vostok (GMT+6)"
                },
                {
                    "value": "Arctic/Longyearbyen",
                    "title": "Arctic/Longyearbyen (GMT+1)"
                },
                {
                    "value": "Asia/Aden",
                    "title": "Asia/Aden (GMT+3)"
                },
                {
                    "value": "Asia/Almaty",
                    "title": "Asia/Almaty (GMT+6)"
                },
                {
                    "value": "Asia/Amman",
                    "title": "Asia/Amman (GMT+2)"
                },
                {
                    "value": "Asia/Anadyr",
                    "title": "Asia/Anadyr (GMT+12)"
                },
                {
                    "value": "Asia/Aqtau",
                    "title": "Asia/Aqtau (GMT+5)"
                },
                {
                    "value": "Asia/Aqtobe",
                    "title": "Asia/Aqtobe (GMT+5)"
                },
                {
                    "value": "Asia/Ashgabat",
                    "title": "Asia/Ashgabat (GMT+5)"
                },
                {
                    "value": "Asia/Baghdad",
                    "title": "Asia/Baghdad (GMT+3)"
                },
                {
                    "value": "Asia/Bahrain",
                    "title": "Asia/Bahrain (GMT+3)"
                },
                {
                    "value": "Asia/Baku",
                    "title": "Asia/Baku (GMT+4)"
                },
                {
                    "value": "Asia/Bangkok",
                    "title": "Asia/Bangkok (GMT+7)"
                },
                {
                    "value": "Asia/Barnaul",
                    "title": "Asia/Barnaul (GMT+7)"
                },
                {
                    "value": "Asia/Beirut",
                    "title": "Asia/Beirut (GMT+2)"
                },
                {
                    "value": "Asia/Bishkek",
                    "title": "Asia/Bishkek (GMT+6)"
                },
                {
                    "value": "Asia/Brunei",
                    "title": "Asia/Brunei (GMT+8)"
                },
                {
                    "value": "Asia/Chita",
                    "title": "Asia/Chita (GMT+9)"
                },
                {
                    "value": "Asia/Choibalsan",
                    "title": "Asia/Choibalsan (GMT+8)"
                },
                {
                    "value": "Asia/Chongqing",
                    "title": "Asia/Chongqing (GMT+8)"
                },
                {
                    "value": "Asia/Colombo",
                    "title": "Asia/Colombo (GMT+5:30)"
                },
                {
                    "value": "Asia/Damascus",
                    "title": "Asia/Damascus (GMT+2)"
                },
                {
                    "value": "Asia/Dhaka",
                    "title": "Asia/Dhaka (GMT+6)"
                },
                {
                    "value": "Asia/Dili",
                    "title": "Asia/Dili (GMT+9)"
                },
                {
                    "value": "Asia/Dubai",
                    "title": "Asia/Dubai (GMT+4)"
                },
                {
                    "value": "Asia/Dushanbe",
                    "title": "Asia/Dushanbe (GMT+5)"
                },
                {
                    "value": "Asia/Gaza",
                    "title": "Asia/Gaza (GMT+2)"
                },
                {
                    "value": "Asia/Harbin",
                    "title": "Asia/Harbin (GMT+8)"
                },
                {
                    "value": "Asia/Hebron",
                    "title": "Asia/Hebron (GMT+2)"
                },
                {
                    "value": "Asia/Ho_Chi_Minh",
                    "title": "Asia/Ho_Chi_Minh (GMT+7)"
                },
                {
                    "value": "Asia/Hong_Kong",
                    "title": "Asia/Hong_Kong (GMT+8)"
                },
                {
                    "value": "Asia/Hovd",
                    "title": "Asia/Hovd (GMT+7)"
                },
                {
                    "value": "Asia/Irkutsk",
                    "title": "Asia/Irkutsk (GMT+8)"
                },
                {
                    "value": "Asia/Jakarta",
                    "title": "Asia/Jakarta (GMT+7)"
                },
                {
                    "value": "Asia/Jayapura",
                    "title": "Asia/Jayapura (GMT+9)"
                },
                {
                    "value": "Asia/Jerusalem",
                    "title": "Asia/Jerusalem (GMT+2)"
                },
                {
                    "value": "Asia/Kabul",
                    "title": "Asia/Kabul (GMT+4:30)"
                },
                {
                    "value": "Asia/Kamchatka",
                    "title": "Asia/Kamchatka (GMT+12)"
                },
                {
                    "value": "Asia/Karachi",
                    "title": "Asia/Karachi (GMT+5)"
                },
                {
                    "value": "Asia/Kashgar",
                    "title": "Asia/Kashgar (GMT+6)"
                },
                {
                    "value": "Asia/Kathmandu",
                    "title": "Asia/Kathmandu (GMT+5:45)"
                },
                {
                    "value": "Asia/Katmandu",
                    "title": "Asia/Katmandu (GMT+5:45)"
                },
                {
                    "value": "Asia/Khandyga",
                    "title": "Asia/Khandyga (GMT+9)"
                },
                {
                    "value": "Asia/Kolkata",
                    "title": "Asia/Kolkata (GMT+5:30)"
                },
                {
                    "value": "Asia/Krasnoyarsk",
                    "title": "Asia/Krasnoyarsk (GMT+7)"
                },
                {
                    "value": "Asia/Kuala_Lumpur",
                    "title": "Asia/Kuala_Lumpur (GMT+8)"
                },
                {
                    "value": "Asia/Kuching",
                    "title": "Asia/Kuching (GMT+8)"
                },
                {
                    "value": "Asia/Kuwait",
                    "title": "Asia/Kuwait (GMT+3)"
                },
                {
                    "value": "Asia/Macau",
                    "title": "Asia/Macau (GMT+8)"
                },
                {
                    "value": "Asia/Magadan",
                    "title": "Asia/Magadan (GMT+11)"
                },
                {
                    "value": "Asia/Makassar",
                    "title": "Asia/Makassar (GMT+8)"
                },
                {
                    "value": "Asia/Manila",
                    "title": "Asia/Manila (GMT+8)"
                },
                {
                    "value": "Asia/Muscat",
                    "title": "Asia/Muscat (GMT+4)"
                },
                {
                    "value": "Asia/Nicosia",
                    "title": "Asia/Nicosia (GMT+2)"
                },
                {
                    "value": "Asia/Novokuznetsk",
                    "title": "Asia/Novokuznetsk (GMT+7)"
                },
                {
                    "value": "Asia/Novosibirsk",
                    "title": "Asia/Novosibirsk (GMT+7)"
                },
                {
                    "value": "Asia/Omsk",
                    "title": "Asia/Omsk (GMT+6)"
                },
                {
                    "value": "Asia/Oral",
                    "title": "Asia/Oral (GMT+5)"
                },
                {
                    "value": "Asia/Phnom_Penh",
                    "title": "Asia/Phnom_Penh (GMT+7)"
                },
                {
                    "value": "Asia/Pontianak",
                    "title": "Asia/Pontianak (GMT+7)"
                },
                {
                    "value": "Asia/Pyongyang",
                    "title": "Asia/Pyongyang (GMT+8:30)"
                },
                {
                    "value": "Asia/Qatar",
                    "title": "Asia/Qatar (GMT+3)"
                },
                {
                    "value": "Asia/Qyzylorda",
                    "title": "Asia/Qyzylorda (GMT+6)"
                },
                {
                    "value": "Asia/Rangoon",
                    "title": "Asia/Rangoon (GMT+6:30)"
                },
                {
                    "value": "Asia/Riyadh",
                    "title": "Asia/Riyadh (GMT+3)"
                },
                {
                    "value": "Asia/Sakhalin",
                    "title": "Asia/Sakhalin (GMT+11)"
                },
                {
                    "value": "Asia/Samarkand",
                    "title": "Asia/Samarkand (GMT+5)"
                },
                {
                    "value": "Asia/Seoul",
                    "title": "Asia/Seoul (GMT+9)"
                },
                {
                    "value": "Asia/Shanghai",
                    "title": "Asia/Shanghai (GMT+8)"
                },
                {
                    "value": "Asia/Singapore",
                    "title": "Asia/Singapore (GMT+8)"
                },
                {
                    "value": "Asia/Srednekolymsk",
                    "title": "Asia/Srednekolymsk (GMT+11)"
                },
                {
                    "value": "Asia/Taipei",
                    "title": "Asia/Taipei (GMT+8)"
                },
                {
                    "value": "Asia/Tashkent",
                    "title": "Asia/Tashkent (GMT+5)"
                },
                {
                    "value": "Asia/Tbilisi",
                    "title": "Asia/Tbilisi (GMT+4)"
                },
                {
                    "value": "Asia/Tehran",
                    "title": "Asia/Tehran (GMT+3:30)"
                },
                {
                    "value": "Asia/Thimphu",
                    "title": "Asia/Thimphu (GMT+6)"
                },
                {
                    "value": "Asia/Tokyo",
                    "title": "Asia/Tokyo (GMT+9)"
                },
                {
                    "value": "Asia/Tomsk",
                    "title": "Asia/Tomsk (GMT+7)"
                },
                {
                    "value": "Asia/Ulaanbaatar",
                    "title": "Asia/Ulaanbaatar (GMT+8)"
                },
                {
                    "value": "Asia/Urumqi",
                    "title": "Asia/Urumqi (GMT+6)"
                },
                {
                    "value": "Asia/Ust-Nera",
                    "title": "Asia/Ust-Nera (GMT+10)"
                },
                {
                    "value": "Asia/Vientiane",
                    "title": "Asia/Vientiane (GMT+7)"
                },
                {
                    "value": "Asia/Vladivostok",
                    "title": "Asia/Vladivostok (GMT+10)"
                },
                {
                    "value": "Asia/Yakutsk",
                    "title": "Asia/Yakutsk (GMT+9)"
                },
                {
                    "value": "Asia/Yangon",
                    "title": "Asia/Yangon (GMT+6:30)"
                },
                {
                    "value": "Asia/Yekaterinburg",
                    "title": "Asia/Yekaterinburg (GMT+5)"
                },
                {
                    "value": "Asia/Yerevan",
                    "title": "Asia/Yerevan (GMT+4)"
                },
                {
                    "value": "Atlantic/Azores",
                    "title": "Atlantic/Azores (GMT-1)"
                },
                {
                    "value": "Atlantic/Bermuda",
                    "title": "Atlantic/Bermuda (AST)"
                },
                {
                    "value": "Atlantic/Canary",
                    "title": "Atlantic/Canary (GMT)"
                },
                {
                    "value": "Atlantic/Cape_Verde",
                    "title": "Atlantic/Cape_Verde (GMT-1)"
                },
                {
                    "value": "Atlantic/Faroe",
                    "title": "Atlantic/Faroe (GMT)"
                },
                {
                    "value": "Atlantic/Madeira",
                    "title": "Atlantic/Madeira (GMT)"
                },
                {
                    "value": "Atlantic/Reykjavik",
                    "title": "Atlantic/Reykjavik (GMT)"
                },
                {
                    "value": "Atlantic/South_Georgia",
                    "title": "Atlantic/South_Georgia (GMT-2)"
                },
                {
                    "value": "Atlantic/St_Helena",
                    "title": "Atlantic/St_Helena (GMT)"
                },
                {
                    "value": "Atlantic/Stanley",
                    "title": "Atlantic/Stanley (GMT-3)"
                },
                {
                    "value": "Australia/Adelaide",
                    "title": "Australia/Adelaide (GMT+10:30)"
                },
                {
                    "value": "Australia/Brisbane",
                    "title": "Australia/Brisbane (GMT+10)"
                },
                {
                    "value": "Australia/Broken_Hill",
                    "title": "Australia/Broken_Hill (GMT+10:30)"
                },
                {
                    "value": "Australia/Currie",
                    "title": "Australia/Currie (GMT+11)"
                },
                {
                    "value": "Australia/Darwin",
                    "title": "Australia/Darwin (GMT+9:30)"
                },
                {
                    "value": "Australia/Eucla",
                    "title": "Australia/Eucla (GMT+8:45)"
                },
                {
                    "value": "Australia/Hobart",
                    "title": "Australia/Hobart (GMT+11)"
                },
                {
                    "value": "Australia/Lindeman",
                    "title": "Australia/Lindeman (GMT+10)"
                },
                {
                    "value": "Australia/Lord_Howe",
                    "title": "Australia/Lord_Howe (GMT+11)"
                },
                {
                    "value": "Australia/Melbourne",
                    "title": "Australia/Melbourne (GMT+11)"
                },
                {
                    "value": "Australia/Perth",
                    "title": "Australia/Perth (GMT+8)"
                },
                {
                    "value": "Australia/Sydney",
                    "title": "Australia/Sydney (GMT+11)"
                },
                {
                    "value": "Europe/Amsterdam",
                    "title": "Europe/Amsterdam (GMT+1)"
                },
                {
                    "value": "Europe/Andorra",
                    "title": "Europe/Andorra (GMT+1)"
                },
                {
                    "value": "Europe/Astrakhan",
                    "title": "Europe/Astrakhan (GMT+4)"
                },
                {
                    "value": "Europe/Athens",
                    "title": "Europe/Athens (GMT+2)"
                },
                {
                    "value": "Europe/Belgrade",
                    "title": "Europe/Belgrade (GMT+1)"
                },
                {
                    "value": "Europe/Berlin",
                    "title": "Europe/Berlin (GMT+1)"
                },
                {
                    "value": "Europe/Bratislava",
                    "title": "Europe/Bratislava (GMT+1)"
                },
                {
                    "value": "Europe/Brussels",
                    "title": "Europe/Brussels (GMT+1)"
                },
                {
                    "value": "Europe/Bucharest",
                    "title": "Europe/Bucharest (GMT+2)"
                },
                {
                    "value": "Europe/Budapest",
                    "title": "Europe/Budapest (GMT+1)"
                },
                {
                    "value": "Europe/Busingen",
                    "title": "Europe/Busingen (GMT+1)"
                },
                {
                    "value": "Europe/Chisinau",
                    "title": "Europe/Chisinau (GMT+2)"
                },
                {
                    "value": "Europe/Copenhagen",
                    "title": "Europe/Copenhagen (GMT+1)"
                },
                {
                    "value": "Europe/Dublin",
                    "title": "Europe/Dublin (GMT)"
                },
                {
                    "value": "Europe/Gibraltar",
                    "title": "Europe/Gibraltar (GMT+1)"
                },
                {
                    "value": "Europe/Guernsey",
                    "title": "Europe/Guernsey (GMT)"
                },
                {
                    "value": "Europe/Helsinki",
                    "title": "Europe/Helsinki (GMT+2)"
                },
                {
                    "value": "Europe/Isle_of_Man",
                    "title": "Europe/Isle_of_Man (GMT)"
                },
                {
                    "value": "Europe/Istanbul",
                    "title": "Europe/Istanbul (GMT+3)"
                },
                {
                    "value": "Europe/Jersey",
                    "title": "Europe/Jersey (GMT)"
                },
                {
                    "value": "Europe/Kaliningrad",
                    "title": "Europe/Kaliningrad (GMT+2)"
                },
                {
                    "value": "Europe/Kiev",
                    "title": "Europe/Kiev (GMT+2)"
                },
                {
                    "value": "Europe/Kirov",
                    "title": "Europe/Kirov (GMT+3)"
                },
                {
                    "value": "Europe/Lisbon",
                    "title": "Europe/Lisbon (GMT)"
                },
                {
                    "value": "Europe/Ljubljana",
                    "title": "Europe/Ljubljana (GMT+1)"
                },
                {
                    "value": "Europe/London",
                    "title": "Europe/London (GMT)"
                },
                {
                    "value": "Europe/Luxembourg",
                    "title": "Europe/Luxembourg (GMT+1)"
                },
                {
                    "value": "Europe/Madrid",
                    "title": "Europe/Madrid (GMT+1)"
                },
                {
                    "value": "Europe/Malta",
                    "title": "Europe/Malta (GMT+1)"
                },
                {
                    "value": "Europe/Mariehamn",
                    "title": "Europe/Mariehamn (GMT+2)"
                },
                {
                    "value": "Europe/Minsk",
                    "title": "Europe/Minsk (GMT+3)"
                },
                {
                    "value": "Europe/Monaco",
                    "title": "Europe/Monaco (GMT+1)"
                },
                {
                    "value": "Europe/Moscow",
                    "title": "Europe/Moscow (GMT+3)"
                },
                {
                    "value": "Europe/Oslo",
                    "title": "Europe/Oslo (GMT+1)"
                },
                {
                    "value": "Europe/Paris",
                    "title": "Europe/Paris (GMT+1)"
                },
                {
                    "value": "Europe/Podgorica",
                    "title": "Europe/Podgorica (GMT+1)"
                },
                {
                    "value": "Europe/Prague",
                    "title": "Europe/Prague (GMT+1)"
                },
                {
                    "value": "Europe/Riga",
                    "title": "Europe/Riga (GMT+2)"
                },
                {
                    "value": "Europe/Rome",
                    "title": "Europe/Rome (GMT+1)"
                },
                {
                    "value": "Europe/Samara",
                    "title": "Europe/Samara (GMT+4)"
                },
                {
                    "value": "Europe/San_Marino",
                    "title": "Europe/San_Marino (GMT+1)"
                },
                {
                    "value": "Europe/Sarajevo",
                    "title": "Europe/Sarajevo (GMT+1)"
                },
                {
                    "value": "Europe/Simferopol",
                    "title": "Europe/Simferopol (GMT+3)"
                },
                {
                    "value": "Europe/Skopje",
                    "title": "Europe/Skopje (GMT+1)"
                },
                {
                    "value": "Europe/Sofia",
                    "title": "Europe/Sofia (GMT+2)"
                },
                {
                    "value": "Europe/Stockholm",
                    "title": "Europe/Stockholm (GMT+1)"
                },
                {
                    "value": "Europe/Tallinn",
                    "title": "Europe/Tallinn (GMT+2)"
                },
                {
                    "value": "Europe/Tirane",
                    "title": "Europe/Tirane (GMT+1)"
                },
                {
                    "value": "Europe/Ulyanovsk",
                    "title": "Europe/Ulyanovsk (GMT+4)"
                },
                {
                    "value": "Europe/Uzhgorod",
                    "title": "Europe/Uzhgorod (GMT+2)"
                },
                {
                    "value": "Europe/Vaduz",
                    "title": "Europe/Vaduz (GMT+1)"
                },
                {
                    "value": "Europe/Vatican",
                    "title": "Europe/Vatican (GMT+1)"
                },
                {
                    "value": "Europe/Vienna",
                    "title": "Europe/Vienna (GMT+1)"
                },
                {
                    "value": "Europe/Vilnius",
                    "title": "Europe/Vilnius (GMT+2)"
                },
                {
                    "value": "Europe/Volgograd",
                    "title": "Europe/Volgograd (GMT+3)"
                },
                {
                    "value": "Europe/Warsaw",
                    "title": "Europe/Warsaw (GMT+1)"
                },
                {
                    "value": "Europe/Zagreb",
                    "title": "Europe/Zagreb (GMT+1)"
                },
                {
                    "value": "Europe/Zaporozhye",
                    "title": "Europe/Zaporozhye (GMT+2)"
                },
                {
                    "value": "Europe/Zurich",
                    "title": "Europe/Zurich (GMT+1)"
                },
                {
                    "value": "GMT",
                    "title": "GMT (GMT)"
                },
                {
                    "value": "Indian/Antananarivo",
                    "title": "Indian/Antananarivo (GMT+3)"
                },
                {
                    "value": "Indian/Chagos",
                    "title": "Indian/Chagos (GMT+6)"
                },
                {
                    "value": "Indian/Christmas",
                    "title": "Indian/Christmas (GMT+7)"
                },
                {
                    "value": "Indian/Cocos",
                    "title": "Indian/Cocos (GMT+6:30)"
                },
                {
                    "value": "Indian/Comoro",
                    "title": "Indian/Comoro (GMT+3)"
                },
                {
                    "value": "Indian/Kerguelen",
                    "title": "Indian/Kerguelen (GMT+5)"
                },
                {
                    "value": "Indian/Mahe",
                    "title": "Indian/Mahe (GMT+4)"
                },
                {
                    "value": "Indian/Maldives",
                    "title": "Indian/Maldives (GMT+5)"
                },
                {
                    "value": "Indian/Mauritius",
                    "title": "Indian/Mauritius (GMT+4)"
                },
                {
                    "value": "Indian/Mayotte",
                    "title": "Indian/Mayotte (GMT+3)"
                },
                {
                    "value": "Indian/Reunion",
                    "title": "Indian/Reunion (GMT+4)"
                },
                {
                    "value": "Pacific/Apia",
                    "title": "Pacific/Apia (GMT+14)"
                },
                {
                    "value": "Pacific/Auckland",
                    "title": "Pacific/Auckland (GMT+13)"
                },
                {
                    "value": "Pacific/Bougainville",
                    "title": "Pacific/Bougainville (GMT+11)"
                },
                {
                    "value": "Pacific/Chatham",
                    "title": "Pacific/Chatham (GMT+13:45)"
                },
                {
                    "value": "Pacific/Chuuk",
                    "title": "Pacific/Chuuk (GMT+10)"
                },
                {
                    "value": "Pacific/Easter",
                    "title": "Pacific/Easter (GMT-5)"
                },
                {
                    "value": "Pacific/Efate",
                    "title": "Pacific/Efate (GMT+11)"
                },
                {
                    "value": "Pacific/Enderbury",
                    "title": "Pacific/Enderbury (GMT+13)"
                },
                {
                    "value": "Pacific/Fakaofo",
                    "title": "Pacific/Fakaofo (GMT+13)"
                },
                {
                    "value": "Pacific/Fiji",
                    "title": "Pacific/Fiji (GMT+13)"
                },
                {
                    "value": "Pacific/Funafuti",
                    "title": "Pacific/Funafuti (GMT+12)"
                },
                {
                    "value": "Pacific/Galapagos",
                    "title": "Pacific/Galapagos (GMT-6)"
                },
                {
                    "value": "Pacific/Gambier",
                    "title": "Pacific/Gambier (GMT-9)"
                },
                {
                    "value": "Pacific/Guadalcanal",
                    "title": "Pacific/Guadalcanal (GMT+11)"
                },
                {
                    "value": "Pacific/Guam",
                    "title": "Pacific/Guam (GMT+10)"
                },
                {
                    "value": "Pacific/Honolulu",
                    "title": "Pacific/Honolulu (HST)"
                },
                {
                    "value": "Pacific/Johnston",
                    "title": "Pacific/Johnston (HAST)"
                },
                {
                    "value": "Pacific/Kiritimati",
                    "title": "Pacific/Kiritimati (GMT+14)"
                },
                {
                    "value": "Pacific/Kosrae",
                    "title": "Pacific/Kosrae (GMT+11)"
                },
                {
                    "value": "Pacific/Kwajalein",
                    "title": "Pacific/Kwajalein (GMT+12)"
                },
                {
                    "value": "Pacific/Majuro",
                    "title": "Pacific/Majuro (GMT+12)"
                },
                {
                    "value": "Pacific/Marquesas",
                    "title": "Pacific/Marquesas (GMT-9:30)"
                },
                {
                    "value": "Pacific/Midway",
                    "title": "Pacific/Midway (GMT-11)"
                },
                {
                    "value": "Pacific/Nauru",
                    "title": "Pacific/Nauru (GMT+12)"
                },
                {
                    "value": "Pacific/Niue",
                    "title": "Pacific/Niue (GMT-11)"
                },
                {
                    "value": "Pacific/Norfolk",
                    "title": "Pacific/Norfolk (GMT+11)"
                },
                {
                    "value": "Pacific/Noumea",
                    "title": "Pacific/Noumea (GMT+11)"
                },
                {
                    "value": "Pacific/Pago_Pago",
                    "title": "Pacific/Pago_Pago (GMT-11)"
                },
                {
                    "value": "Pacific/Palau",
                    "title": "Pacific/Palau (GMT+9)"
                },
                {
                    "value": "Pacific/Pitcairn",
                    "title": "Pacific/Pitcairn (GMT-8)"
                },
                {
                    "value": "Pacific/Pohnpei",
                    "title": "Pacific/Pohnpei (GMT+11)"
                },
                {
                    "value": "Pacific/Ponape",
                    "title": "Pacific/Ponape (GMT+11)"
                },
                {
                    "value": "Pacific/Port_Moresby",
                    "title": "Pacific/Port_Moresby (GMT+10)"
                },
                {
                    "value": "Pacific/Rarotonga",
                    "title": "Pacific/Rarotonga (GMT-10)"
                },
                {
                    "value": "Pacific/Saipan",
                    "title": "Pacific/Saipan (GMT+10)"
                },
                {
                    "value": "Pacific/Tahiti",
                    "title": "Pacific/Tahiti (GMT-10)"
                },
                {
                    "value": "Pacific/Tarawa",
                    "title": "Pacific/Tarawa (GMT+12)"
                },
                {
                    "value": "Pacific/Tongatapu",
                    "title": "Pacific/Tongatapu (GMT+13)"
                },
                {
                    "value": "Pacific/Truk",
                    "title": "Pacific/Truk (GMT+10)"
                },
                {
                    "value": "Pacific/Wake",
                    "title": "Pacific/Wake (GMT+12)"
                },
                {
                    "value": "Pacific/Wallis",
                    "title": "Pacific/Wallis (GMT+12)"
                }
            ];
            return timezones;
        }

    }



})();





(function () {
    'use strict';

    angular.module('ash', []).directive("ngInfiniteScroll", function ($timeout, Data, Resource) {

        return {
            restrict: 'A',
            scope: {
                options: '=',
                items: '='
            },
            link: function ($scope, element) {
                $scope.lastRemain = undefined;
                $scope.offset = 0;
                $scope.inProcess = false;
                $scope.options = angular.extend({
                    limit: 10,
                    threshold: 50,
                    data: []
                }, $scope.options);
                $scope.hasItems = true;

                if (!$scope.options.resource && !Array.isArray($scope.options.data)) {
                    $scope.options.data = [$scope.options.data];
                }
                $scope.strategy = $scope.options.resource ? Resource : Data;
                $scope.strategy.addItems($scope);

                element.bind('scroll', function () {
                    var remain = element[0].scrollHeight - (element[0].clientHeight + element[0].scrollTop);

                    if (remain < $scope.options.threshold && (!$scope.lastRemain || (remain - $scope.lastRemain) < 0) && $scope.hasItems && !$scope.inProcess) {
                        $scope.$apply(function() {
                            $scope.strategy.addItems($scope);
                        });
                    }

                    $scope.lastRemain = remain;
                });
            }
        }

    });
    //
    // app.factory('Data', function() {
    //     return {
    //         addItems: function($scope) {
    //             $scope.inProcess = true;
    //
    //             var from = $scope.offset * $scope.options.limit;
    //             if (from < $scope.options.data.length) {
    //                 var to = from + $scope.options.limit;
    //                 to = to > $scope.options.data.length ? $scope.options.data.length : to;
    //
    //                 for (var i = from; i < to; i++) {
    //                     $scope.items = $scope.items.concat($scope.options.data[i]);
    //                 }
    //
    //                 $scope.offset++;
    //             } else {
    //                 $scope.hasItems = false;
    //             }
    //
    //             $scope.inProcess = false;
    //         }
    //     };
    // });
    //
    // app.factory('Resource', function() {
    //     return {
    //         addItems: function($scope) {
    //             $scope.inProcess = true;
    //             $scope.options.resource.query(
    //                 { offset: $scope.offset * $scope.options.limit, limit: $scope.options.limit },
    //                 function (data) {
    //                     if (data.models.length == 0) {
    //                         $scope.hasItems = false;
    //                     } else {
    //                         for (var i = 0; i < data.models.length; i++) {
    //                             $scope.items = $scope.items.concat(data.models[i]);
    //                         }
    //                     }
    //
    //                     $scope.inProcess = false;
    //                 }
    //             );
    //
    //         }
    //     };
    // });

})();

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.clone = function(){
    return this.slice(0);
};


// /*
//  用途：检查输入字符串是否只由英文字母和数字和文字组成
//  输入：
//  s：字符串
//  返回：
//  如果通过验证返回true,否则返回false
//
//  */
// function noSpecialSymbols(s) {
//     var regu = "^[\a-\z\A-\Z0-9\u4E00-\u9FA5\_\:\.\{\} ]+$";
//     var re = new RegExp(regu);
//     if (re.test(s)) {
//         return true;
//     } else {
//         return false;
//     }
// }
//
// /*
//  用途：检查输入字符串是否只由英文字母和数字和文字组成
//  输入：
//  s：字符串
//  返回：
//  如果通过验证返回true,否则返回false
//
//  */
// function isNumber_Letter(s) {
//     var regu = "^[\a-\z\A-\Z0-9\_]+$";
//     var re = new RegExp(regu);
//     if (re.test(s)) {
//         return true;
//     } else {
//         return false;
//     }
// }
// /*
//  用途：检查输入字符串是否为空或者全部都是空格
//  输入：str
//  返回：
//  如果全是空返回true,否则返回false
//  */
// function isNull( str )
// {
//     if ( !str || str == "" ) return true;
//     var regu = "^[ ]+$";
//     var re = new RegExp(regu);
//     return re.test(str);
// }