﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

using ParentDal;

using System.Net.Http;
using System.Web.Http;

namespace WebsiteApi.Controllers
{
    [ApiController]
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    public class ParentController : Controller
    {
        //  Call AddParent from the helper class
        //int result = ParentMethods.AddParent("Username", "Email", "1234", "10/10/2000");




        [Microsoft.AspNetCore.Mvc.HttpGet]
        public ContentResult Get()
        {
            Console.WriteLine("Email: " + Request.Headers["email"]);
            Console.WriteLine("Password: " + Request.Headers["password"]);
            //Console.WriteLine(ParentMethods.AddParent("DummyUsername", Request.Headers["email"], Request.Headers["password"], DateTime.Now.ToString()));
            //"10/10/2000"

            bool result = false; 
            
            if(!Request.Headers["email"].ToString().Equals("") && !Request.Headers["password"].ToString().Equals(""))//  Just for debugging 
            {
                result = ParentMethods.IsExists(Request.Headers["email"], Request.Headers["password"]);
            }

            return base.Content(JsonSerializer.Serialize(new { Authenticated = result }), "application/json", System.Text.Encoding.UTF8);
        }
    }
}
