var express = require('express');
var app = express();


//CORS middleware
/*
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'cool beans' }));
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});
*/

// Add headers
/*
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
*/

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,Authorization, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

// user
app.post('/api/v1/account/auth', function (req, res) {
  //res.send('Hello World!');
    //admin and user token
    //res.json({ token: 'eyJraWQiOiJJT1RfU0VDVVJFS0VZIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJJT1RfUExBVEZPUk1fSVNTVUVSIiwiYXVkIjoiSU9UX1BMQVRGT1JNX0FVRElFTkNFIiwiZXhwIjoxNzgwMDc0MTU1LCJqdGkiOiJjcTFDMC10RVBXUEk1XzN2Z1FsQ2RBIiwiaWF0IjoxNDY5MDM0MTU1LCJzdWIiOiJhZG1pbiIsImNsYWltLnJvbGVzIjpbIkFETUlOIl19.pzXQDv82gPrpNVas_2DHt8mihoNhqw8mnAMlDwnCC-Jkj5xodi_UBTVG8thOLaNSSLpflOqhJ8eJMstZTEJI9Nsoy1axBIun-U47NGpeZF76GUI9vh7wf_9EpwKVs0UDyK5amAVrzyiO6nQEjtMPPbGX_fWfUasB_JP5H34O2pqTl5cb6irSoJxB-_MB7lxZYJ4V9u0W9XRuFbaQtdG5YSiib7-WHHEhOIQ6X3Xg7y9josfUf41BfD9cOs2U_k3WZjiiosZVajy8DatMxF96BZuGVRh4VxozvczuiThyLAcsXW2TjYen4bgGJcH2AG7ip002NDrPxpaE2STcJwtxBQ' });
    res.json({ token: 'eyJraWQiOiJJT1RfUExBVEZPUk1fS0VZIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJJT1RfUExBVEZPUk1fSVNTVUVSIiwiYXVkIjoiSU9UX1BMQVRGT1JNX0FVRElFTkNFIiwiZXhwIjozNjY3MDIyNjE4LCJqdGkiOiJMRFF0WHNWY0MxMnc3LWVVT203eFZnIiwiaWF0IjoxNDg5NzQyNjE4LCJzdWIiOiJkZW1vIiwiY2xhaW0ucm9sZXMiOlsiVEVOQU5UIl19.AosBEEcLV-legs-007x3VwgKerPOCqDitmtm5kBA2X8202yLjJ1dQXCIqkzswkUy9G6JpMRIBHVCWpKAmxeEIhIRF1gQjOQVDa5TukEYbnpG53maLgcWm3gsMn5y5yCHbOk0YR8KFGQZvDxAaP7-crpGS1zRwGRfMxdgqteBDPNmHq9W8IkhSTLsB0n6PXjLV3UbUZHeYQ5jyadYJZXTOoCxLFMWYdp6wM7c_7O7MLTkJRk4r_IRfyDinLEA-kOReuVIoqKmq2oBlH5EeHPXTp9Ygdlp0A23HkX9Fip0f4dwr2YKjizUntqtSGPGB0b0IuSbF_HY_6LxalcQ8igRlQ'});

    /*res.json(
        {
        "principal": "admin",
        "credential": "p0o9i8u7"
    });*/
});
app.get('/iot/api/v1/account/profile', function (req, res) {
    //res.send('Hello World!');
   /* res.json({ 'type': 'ADMIN', 'roles':['TENANT','ADMIN'], 'nickName':'nickName-otherplayer',
    'email':'devuser@demoproject.org',
    'creationDate':'2016-06-25','enabled':true,'username':'username-le'});*/

   //admin and tenant
   /*res.json(
       {
           "type": "ADMIN",
           "roles": [
               "TENANT",
               "ADMIN"
           ],
           "nickName": "nickName-otherplayer",
           "email": "devuser@demoproject.org",
           "creationDate": "2016-06-25",
           "enabled": true,
           "username": "username-le"
       }


   );*/

    res.json(
    {
        "id": 3,
        "username": "demo",
        "email": "demo@demo.com",
        "nickName": "测试",
        "enabled": true,
        "type": "tenant",
        "creationDate": "2017-03-07",
        "roles": [
        "TENANT"
    ],
        "admin": false,
        "route": "account/profile",
        "reqParams": null,
        "restangularized": true,
        "fromServer": true,
        "parentResource": null,
        "restangularCollection": false
    }
    );


});









app.post('/iot/api/v1/account/password/change', function (req, res) {
    //res.send('Hello World!');
    res.json();
});
app.put('/iot/api/v1/account/profile', function (req, res){
    console.log(req);
    res.json();
});

//register
app.post('/iot/api/v1/ua/v1/register', function (req, res) {
    //res.send('add');
    res.json({
        "code":0,
        "info":"Success"
    });
});

// Tenant
app.get('/iot/api/v1/tenants', function (req, res) {
    //res.send('get all');
    res.json({content:[{'email':'1devuser@demoproject.org', 'nickName':'1GE Tenant','username':'1username-le','enabled':true},
        {'email':'1devuser@demoproject.org', 'nickName':'1GE Tenant','username':'1username-le','enabled':true},
        {'email':'1devuser@demoproject.org', 'nickName':'2GE Tenant','username':'1username-le','enabled':true},
        {'email':'1devuser@demoproject.org', 'nickName':'3GE Tenant','username':'1username-le','enabled':true}]});
});
app.get('/iot/api/v1/tenants/id', function (req, res) {
    //res.send('get');
    res.json({'email':'1devuser@demoproject.org', 'nickName':'1GE Tenant','username':'1username-le','enabled':true});
});
app.put('/iot/api/v1/tenants/tenant1', function (req, res) {
    //res.send('update');
    res.json();
});
app.delete('/iot/api/v1/tenants/tenant1', function (req, res) {
    //res.send('delete');
    res.json();
});
app.post('/iot/api/v1/tenants', function (req, res) {
    //res.send('add');
    res.json();
});

// Device Manager
app.get('/iot/api/v1/devices', function (req, res) {
    //res.send('get all');
    res.json([{'sn':'1devuserdemoproject.org','name':'0username-le','status':true},
        {'sn':'2devuserdemoproject.org','name':'1username-le','status':true},
        {'sn':'3devuserdemoproject.org','name':'2username-le','status':true},
        {'sn':'4devuserdemoproject.org','name':'3username-le','status':true}]);
});
app.get('/iot/api/v1/devices/id', function (req, res) {
    //res.send('get');
    res.json({'sn':'1devuserdemoproject.org','name':'1username-le','status':true});
});
app.put('/iot/api/v1/devices/device1', function (req, res) {
    //res.send('update');
    res.json();
});
app.post('/iot/api/v1/devices', function (req, res) {
    //res.send('add');
    res.json();
});

// Application

app.get('/iot/api/v1/apps', function (req, res) {
    res.json(


/*
        {
        "sn": "Windows",
        "name": "Edison",
        "token": "33-v",
        "version": "supply",
        "createdby" : "haihang",
        "date": "2013.12.12"
    }
*/




    {
        "page" : 1,
        "pageSize" : 10,
        "totalRecords" : 1,
        "content" : [ {
        "createdBy" : "demo",
        "createdDate" : "2017-03-07T07:24:29+0000",
        "lastModifiedBy" : "demo",
        "lastModifiedDate" : "2017-03-07T07:24:29+0000",
        "id" : 1,
        "name" : "test",
        "displayName" : "测试产品1",
        "allowAutoRegister" : false,
        "active" : true,
        "credentialsProvider" : "trustful",
        "description" : "",
        "owner" : "demo"
    },
        {
            "createdBy" : "demo",
            "createdDate" : "2017-03-07T07:24:29+0000",
            "lastModifiedBy" : "demo",
            "lastModifiedDate" : "2017-03-07T07:24:29+0000",
            "id" : 1,
            "name" : "test",
            "displayName" : "测试产品22",
            "allowAutoRegister" : false,
            "active" : true,
            "credentialsProvider" : "trustful",
            "description" : "",
            "owner" : "demo"
        }


    ],
        "records" : 1,
        "hasPreviousPage" : false,
        "isFirstPage" : true,
        "hasNextPage" : false,
        "isLastPage" : true,
        "hasContent" : true,
        "totalPages" : 1
    }





    );
});



//metric



app.get('/iot/api/v1/metrics', function (req, res) {
    res.json(
        {
            "applicationsCount" : 25,
            "productsCount" : 16,
            "devicesCount" : 5,
            "eventClassFamiliesCount" : 3
        }
    );
});
//product
//post
app.post('/iot/api/v1/products', function (req, res) {
    
    res.json();
});
//get all
app.get('/iot/api/v1/products', function (req, res) {
    res.json(

        {
            "page" : 1,
            "pageSize" : 10,
            "totalRecords" : 1,
            "content" : [ {
                "createdBy" : "demo",
                "createdDate" : "2017-03-07T07:24:29+0000",
                "lastModifiedBy" : "demo",
                "lastModifiedDate" : "2017-03-07T07:24:29+0000",
                "id" : 1,
                "name" : "物联网服务",
                "displayName" : "让万物智联",
                "allowAutoRegister" : false,
                "active" : true,
                "credentialsProvider" : "trustful",
                "description" : "让万物智联",
                "owner" : "demo",
                "avatarUrl":"/images/iot.png",
                "accessUrl":"/cloud/iot",
                "accessToken":"eyJraWQiOiJJT1RfUExBVEZPUk1fS0VZIiwiYWxnIjoiUlM"
            },
                {
                    "createdBy" : "demo",
                    "createdDate" : "2017-03-07T07:24:29+0000",
                    "lastModifiedBy" : "demo",
                    "lastModifiedDate" : "2017-03-07T07:24:29+0000",
                    "id" : 1,
                    "name" : "舆情服务",
                    "displayName" : "获取专属定制信息",
                    "allowAutoRegister" : false,
                    "active" : true,
                    "credentialsProvider" : "trustful",
                    "description" : "获取专属定制信息",
                    "owner" : "demo",
                    "avatarUrl":"/images/news.jpeg",
                    "accessUrl":"/cloud/news",
                    "accessToken":"eyJraWQiOiJJT1RfUExBVEZPUk1fS0VZIiwiYWxnIjoiUlM"
                },
                {
                    "createdBy" : "demo",
                    "createdDate" : "2017-03-07T07:24:29+0000",
                    "lastModifiedBy" : "demo",
                    "lastModifiedDate" : "2017-03-07T07:24:29+0000",
                    "id" : 1,
                    "name" : "人工智能",
                    "displayName" : "个人智能助手",
                    "allowAutoRegister" : false,
                    "active" : true,
                    "credentialsProvider" : "trustful",
                    "description" : "个人智能助手",
                    "owner" : "demo",
                    "avatarUrl":"/images/ai.jpeg",
                    "accessUrl":"/cloud/ai",
                    "accessToken":"eyJraWQiOiJJT1RfUExBVEZPUk1fS0VZIiwiYWxnIjoiUlM"
                }


            ],
            "records" : 1,
            "hasPreviousPage" : false,
            "isFirstPage" : true,
            "hasNextPage" : false,
            "isLastPage" : true,
            "hasContent" : true,
            "totalPages" : 1
        }
    );
});
//get one pro by id
app.get('/iot/api/v1/products/id', function (req, res) {
    res.json(
        [
            {"productName": "computer1", "displayName": "My Product1", "allowAutoRegister": false, "active": true, "description": "this is product1!!!!","profiles" : [{'key' : 'name','val' : 'string'},{'key' : 'name','val' : 'number'}]},
            {"productName": "computer2", "displayName": "My Product2", "allowAutoRegister": false, "active": true, "description": "this is product2!!!!","profiles" : [{'key' : 'name','val' : 'string'},{'key' : 'name','val' : 'number'}]},
            {"productName": "computer3", "displayName": "My Product3", "allowAutoRegister": false, "active": true, "description": "this is product3!!!!","profiles" : [{'key' : 'name','val' : 'string'},{'key' : 'name','val' : 'number'}]}
        ]
    );
});
//delete
app.delete('/iot/api/v1/products/product1', function (req, res) {
    
    res.json();
});
//modify
app.put('/iot/api/v1/products/product1', function (req, res) {
    res.json();
});
    
app.delete('/iot/api/v1/devices/device1', function (req, res) {
    //res.send('delete');
    res.json();
});


app.get('/', function(req, res, next) {
  // Handle the get for this route
  res.send('Hello World!');
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
 res.send('Hello World post!');
});


app.listen(8999, function () {
  console.log('API server listening on port 8999!');
});
