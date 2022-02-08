﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

using ProviderDal;

using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using WMS.Models.VM;

//	--- To remove ---
using Microsoft.AspNetCore.Cors;
using ProvidersApi;
using Provider_DAL;
//using Microsoft.AspNet.WebApi.Core;

namespace ParentsApi.Controllers
{
	[ApiController]
	[Microsoft.AspNetCore.Mvc.Route("api/[controller]/[action]")]

	public class ProviderController : Controller
	{
	#region -------------  HTTP functions  -------------

		// Puts a new user into the database
		// Returns is the register was successful or failed, returns if the user alreadt exists in the database
		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("ProviderRegister")]
		public ContentResult ProviderRegister()
		{
			string result = ProviderHelperFunctions.ProviderRegister(Request.Headers["fullName"].ToString(), Request.Headers["email"].ToString(), Request.Headers["password"].ToString(), Request.Headers["occupation"].ToString());
			return base.Content(result);
		}

		//	Checks if the user exists in the database
		//	Returns information about the user
		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("ProviderLogin")]
		public ContentResult ProviderLogin()
		{
			//	Check if this works
			string result = ProviderHelperFunctions.ProviderLogin(Request.Headers["email"].ToString(), Request.Headers["password"].ToString());

			return base.Content(result);
		}


		[Microsoft.AspNetCore.Mvc.HttpGet]
		[Microsoft.AspNetCore.Mvc.ActionName("GetProviders")]
		public ContentResult GetProviders()
		{
			return base.Content(JsonConvert.SerializeObject(
				ProviderHelperFunctions.GetProviderInfos()
				));
		}
		#endregion

		/// <summary>
		/// Converts a given UTF-8 encoded string to Unicode and returns unicode as string
		/// </summary>
		/// <param name="utf8text"></param>
		/// <returns></returns>
		private string ConvertToUnicode(string utf8text)
		{ return Encoding.Unicode.GetString(UTF8Encoding.Convert(Encoding.UTF8, Encoding.Unicode, Encoding.UTF8.GetBytes(utf8text))); }
	}
}