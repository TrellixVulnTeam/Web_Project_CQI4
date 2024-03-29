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

		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("ConfirmProvider")]
		public ContentResult ConfirmProvider()
		{
			//	Get provider id
			int providerId = int.Parse(Request.Headers["providerId"].ToString());

			//	Toggle status to the provider
			ProviderHelperFunctions.ConfirmProvider(providerId);

			return base.Content(null);
		}

		[Microsoft.AspNetCore.Mvc.HttpGet]
		[Microsoft.AspNetCore.Mvc.ActionName("GetArticles")]
		public ContentResult GetArticles()
		{
			string tableName = Request.Headers["tableName"].ToString();
			string filterValue = Request.Headers["filterValue"].ToString();
			//object a = JsonConvert.DeserializeObject(ProviderHelperFunctions.GetArticlesBy(tableName, filterValue));
			return base.Content(JsonConvert.SerializeObject(ProviderHelperFunctions.GetArticlesBy(tableName, filterValue)));
		}

		[Microsoft.AspNetCore.Mvc.HttpGet]
		[Microsoft.AspNetCore.Mvc.ActionName("GetArticlesForProvider")]
		public ContentResult GetArticlesForProvider()
		{
			int providerId = int.Parse(Request.Headers["providerId"].ToString());

			return base.Content(JsonConvert.SerializeObject(ProviderHelperFunctions.GetArticlesForProvider(providerId)));
		}

		[Microsoft.AspNetCore.Mvc.HttpGet]
		[Microsoft.AspNetCore.Mvc.ActionName("GetArticleById")]
		public ContentResult GetArticleById()
		{
			int articleId = int.Parse(Request.Headers["articleId"].ToString());

			return base.Content(JsonConvert.SerializeObject(ProviderHelperFunctions.GetArticleById(articleId)));
		}

		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("DeleteArticle")]
		public void DeleteArticle()
		{
			int articleId = int.Parse(Request.Headers["articleId"].ToString());

			 ProviderHelperFunctions.DeleteArticle(articleId);
		}



		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("PostArticle")]
		public ContentResult PostArticle()
		{
			int providerId= int.Parse(Request.Headers["providerId"].ToString());
			int topicId = int.Parse(Request.Headers["topicId"].ToString());
			string content = Request.Headers["content"].ToString();
			string title = Request.Headers["title"].ToString();

			return base.Content(ProviderHelperFunctions.PostArticle(providerId, topicId, content, title));
		}

		[Microsoft.AspNetCore.Mvc.HttpGet]
		[Microsoft.AspNetCore.Mvc.ActionName("GetAllTopics")]
		public ContentResult GetAllTopics()
		{
			return base.Content(ProviderHelperFunctions.GetAllTopics());
		}


		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("UpdateProviderInfo")]
		public void UpdateProviderInfo()
		{
			int providerId = int.Parse(Request.Headers["providerId"].ToString());
			string providerName = Request.Headers["providerName"].ToString();
			string providerEmail = Request.Headers["providerEmail"].ToString();
			string providerOccupation = Request.Headers["providerOccupation"].ToString();
			string providerPhoneNumber = Request.Headers["providerPhoneNumber"].ToString();

			ProviderHelperFunctions.UpdateProviderInfo(providerId, providerName, providerEmail, providerOccupation, providerPhoneNumber);
		}

		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("UpdateArticle")]
		public void UpdateArticle()
		{
			int articleId = int.Parse(Request.Headers["articleId"].ToString());
			string articleTitle = Request.Headers["articleTitle"].ToString();
			string articleContent = Request.Headers["articleContent"].ToString();
			string articleTopic = Request.Headers["articleTopic"].ToString();

			ProviderHelperFunctions.UpdateArticle(articleId, articleTitle, articleContent, articleTopic);
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