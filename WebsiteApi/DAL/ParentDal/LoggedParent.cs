﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebsiteApi.HelperClasses
{
    public class Child
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public bool IsSelected { get; set; }
        public int Id { get; set; }
        public Child()
        {
            Name = "DEFAULT NAME";
            Age = -1;
            IsSelected = false;
            Id = -1;
        }
        public Child(string name, int age)
        {
            Name = name;
            Age = age;
            IsSelected = false;
            Id = -1;
        }
        public Child(string name, int age, bool isSelected, int id)
        {
            Name = name;
            Age = age;
            IsSelected = isSelected;
            Id = id;
        }
        public override string ToString()
        {
            return string.Format("Name: {0}, Age: {1}, Is selected: {2}, Id: {3}", Name, Age, IsSelected, Id);
        }
    }

    public class LoggedParent
    {
        public string Username { get; set; }
        public int Id { get; set; }
        public List<Child> Children { get; }
        public void AddChildren(List<Child> children)
        {
            Children.Concat(children);
        }

        public LoggedParent()
        {
            Username = "DEFAULT USERNAME";
            Id = -1;
            Children = new List<Child>();
        }

        public LoggedParent(string username, int id)
        {
            Username = username;
            Id = id;
            Children = new List<Child>();
        }
    }
}
