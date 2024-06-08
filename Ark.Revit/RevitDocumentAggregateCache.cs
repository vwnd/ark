using RevitSharedResources.Interfaces;
using Autodesk.Revit.DB;

namespace Ark.Revit
{
    public sealed class RevitDocumentAggregateCache : IRevitDocumentAggregateCache
    {
        private readonly Dictionary<Type, IRevitObjectCache> objectCaches;
        public Document Document { get; private set; }

        public RevitDocumentAggregateCache(Document doc)
        {
            this.Document = doc;
            this.objectCaches = new();
        }

        public IRevitObjectCache<T> GetOrInitializeEmptyCacheOfType<T>(out bool isExistingCache)
        {
            return GetOrInitializeCacheOfTypeNullable<T>(null, out isExistingCache);
        }

        public IRevitObjectCache<T> GetOrInitializeCacheOfType<T>(
          Action<IRevitObjectCache<T>> initializer,
          out bool isExistingCache
        )
        {
            return GetOrInitializeCacheOfTypeNullable<T>(initializer, out isExistingCache);
        }

        private IRevitObjectCache<T> GetOrInitializeCacheOfTypeNullable<T>(
          Action<IRevitObjectCache<T>>? initializer,
          out bool isExistingCache
        )
        {
            if (!objectCaches.TryGetValue(typeof(T), out var singleCache))
            {
                isExistingCache = false;
                singleCache = new RevitObjectCache<T>(this);
                if (initializer != null)
                {
                    initializer((IRevitObjectCache<T>)singleCache);
                }
                objectCaches.Add(typeof(T), singleCache);
            }
            else
            {
                isExistingCache = true;
            }
            return (IRevitObjectCache<T>)singleCache;
        }

        public IRevitObjectCache<T>? TryGetCacheOfType<T>()
        {
            if (!objectCaches.TryGetValue(typeof(T), out var singleCache))
            {
                return null;
            }
            return singleCache as IRevitObjectCache<T>;
        }

        public void Invalidate<T>()
        {
            objectCaches.Remove(typeof(T));
        }

        public void InvalidateAll()
        {
            objectCaches.Clear();
        }
    }

    internal class RevitObjectCache<T> : IRevitObjectCache<T>
    {
        private readonly Dictionary<string, T> dataStorage;
        public IRevitDocumentAggregateCache ParentCache { get; }

        public RevitObjectCache(IRevitDocumentAggregateCache parentCache)
        {
            ParentCache = parentCache;
            dataStorage = new();
        }

        public T GetOrAdd(string key, Func<T> factory, out bool isExistingValue)
        {
            if (!dataStorage.TryGetValue(key, out var value))
            {
                isExistingValue = false;
                value = factory();
                dataStorage.Add(key, value);
            }
            else
            {
                isExistingValue = true;
            }

            return value;
        }

        public T? TryGet(string key)
        {
            if (!dataStorage.TryGetValue(key, out var value))
            {
                return default(T);
            }

            return value;
        }

        public bool ContainsKey(string key)
        {
            return dataStorage.ContainsKey(key);
        }

        public ICollection<string> GetAllKeys()
        {
            return dataStorage.Keys;
        }

        public ICollection<T> GetAllObjects()
        {
            return dataStorage.Values;
        }

        public void Set(string key, T value)
        {
            dataStorage[key] = value;
        }

        public void AddMany(IEnumerable<T> elements, Func<T, string> keyFactory)
        {
            foreach (var element in elements)
            {
                var key = keyFactory(element);
                dataStorage[key] = element;
            }
        }

        public void AddMany(Dictionary<string, T> elementMap)
        {
            foreach (var kvp in elementMap)
            {
                dataStorage[kvp.Key] = kvp.Value;
            }
        }

        public void Remove(string key)
        {
            dataStorage.Remove(key);
        }
    }

    //public class UIDocumentProvider
    //{
    //    private UIApplication revitApplication;

    //    public UIDocumentProvider(UIApplication revitApplication)
    //    {
    //        this.revitApplication = revitApplication;
    //    }

    //    private UIDocument uiDocument;

    //    public UIDocument Entity
    //    {
    //        get => uiDocument ?? revitApplication.ActiveUIDocument;
    //        set => uiDocument = value;
    //    }
    //}
}
