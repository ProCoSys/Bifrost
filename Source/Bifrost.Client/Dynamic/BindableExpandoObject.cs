﻿#region License
//
// Copyright (c) 2008-2014, Dolittle (http://www.dolittle.com)
//
// Licensed under the MIT License (http://opensource.org/licenses/MIT)
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at
//
//   http://github.com/dolittle/Bifrost/blob/master/MIT-LICENSE.txt
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using System.Reflection;

namespace Bifrost.Dynamic
{
    public class BindableExpandoObject : DynamicObject, IDictionary<string, object>, INotifyPropertyChanged, ICustomTypeProvider
    {
        Dictionary<string, object> _dictionary;

        public event PropertyChangedEventHandler PropertyChanged;


        void OnPropertyChanged(string name)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(name));

        }
        public BindableExpandoObject()
        {
            _dictionary = new Dictionary<string, object>();
        }

        public Type GetCustomType()
        {
            var type = new BindableExpandoType(typeof(BindableExpandoObject), this);
            return type;
        }


        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            result = _dictionary[binder.Name];
            return true;
        }

        public override bool TrySetMember(SetMemberBinder binder, object value)
        {
            _dictionary[binder.Name] = value;
            OnPropertyChanged(binder.Name);
            return true;
        }


        public void Add(string key, object value)
        {
            _dictionary.Add(key, value);
        }

        public bool ContainsKey(string key)
        {
            return _dictionary.ContainsKey(key);
        }

        public ICollection<string> Keys
        {
            get { return _dictionary.Keys; }
        }

        public bool Remove(string key)
        {
            return _dictionary.Remove(key);
        }

        public bool TryGetValue(string key, out object value)
        {
            return _dictionary.TryGetValue(key, out value);
        }

        public ICollection<object> Values
        {
            get { return _dictionary.Values; }
        }

        public object this[string key]
        {
            get
            {
                if (!_dictionary.ContainsKey(key))
                    return null;
                return _dictionary[key];
            }
            set
            {
                _dictionary[key] = value;
                OnPropertyChanged(key);
            }
        }

        public void Add(KeyValuePair<string, object> item)
        {
            _dictionary.Add(item.Key, item.Value);
        }

        public void Clear()
        {
            _dictionary.Clear();
        }

        public bool Contains(KeyValuePair<string, object> item)
        {
            return _dictionary.Contains(item);
        }

        public void CopyTo(KeyValuePair<string, object>[] array, int arrayIndex)
        {
        }

        public int Count
        {
            get { return _dictionary.Count; }
        }

        public bool IsReadOnly
        {
            get { return false; }
        }

        public bool Remove(KeyValuePair<string, object> item)
        {
            return _dictionary.Remove(item.Key);
        }

        public IEnumerator<KeyValuePair<string, object>> GetEnumerator()
        {
            return _dictionary.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return _dictionary.GetEnumerator();
        }
    }
}
