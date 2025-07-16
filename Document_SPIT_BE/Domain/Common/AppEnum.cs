using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Domain.Common
{
    public enum Role_Enum
    {
        [Display(Name = "Admin")]
        Admin,
        [Display(Name = "User")]
        User,
    }
    public enum Time_Enum
    {
        [Display(Name = "Sáng")]
        Sang,
        [Display(Name = "Chiều")]
        Chieu,
        [Display(Name = "Tối")]
        Toi,
    }
    public enum StatusDocument_Enum
    {
        [Display(Name = "Đã duyệt")]
        Approved,
        [Display(Name = "Không duyệt")]
        Rejected,
        [Display(Name = "Đang chờ duyệt")]
        Pending,
    }
    public enum Function_Enum
    {
        Create_Document,
        Review_Document,
        Update_Document,
        Delete_Document,
    }
    public static class EnumExtensions
    {
        // Lấy tên hiển thị của enum từ giá trị
        public static string GetEnumDisplayName<T>(this T enumType)
        {
            return enumType.GetType().GetMember(enumType.ToString())
                           .First()
                           .GetCustomAttribute<DisplayAttribute>()
                           .Name;
        }
        // Lấy tên hiển thị của enum từ giá trị
        public static string GetDisplayName(Enum value)
        {
            return value.GetType()
                        .GetField(value.ToString())
                        ?.GetCustomAttribute<DisplayAttribute>()
                        ?.Name ?? value.ToString();
        }
        // Lấy tên hiển thị của enum từ giá trị
        public static bool IsValidDisplayName(string displayName, Type enumType)
        {
            return Enum.GetValues(enumType).Cast<Enum>().Any(e => GetDisplayName(e) == displayName);
        }
        // Lấy enum từ tên hiển thị
        public static T? GetEnumFromDisplayName<T>(string displayName) where T : struct, Enum
        {
            foreach (T enumValue in Enum.GetValues(typeof(T)))
            {
                var name = enumValue.GetType()
                                    .GetField(enumValue.ToString())
                                    ?.GetCustomAttribute<DisplayAttribute>()
                                    ?.Name;

                if (name == displayName)
                {
                    return enumValue;
                }
            }

            return null; // hoặc throw nếu muốn
        }
        // Lấy tất cả tên hiển thị của enum T
        public static List<string> GetAllDisplayNames<T>() where T : struct, Enum
        {
            return Enum.GetValues(typeof(T)).Cast<T>()
                       .Select(e => e.GetType()
                                      .GetField(e.ToString())
                                      ?.GetCustomAttribute<DisplayAttribute>()
                                      ?.Name ?? e.ToString())
                       .ToList();
        }
        // Lấy tất cả tên hiển thị của enum T
        public static T? GetEnumValueFromDisplayName<T>(string input) where T : struct, Enum
        {
            var type = typeof(T);
            var fields = type.GetFields(BindingFlags.Public | BindingFlags.Static);

            foreach (var field in fields)
            {
                // So sánh với Display(Name)
                var displayAttr = field.GetCustomAttribute<DisplayAttribute>();
                if (displayAttr?.Name != null &&
                    displayAttr.Name.Equals(input, StringComparison.OrdinalIgnoreCase))
                {
                    return (T)field.GetValue(null)!;
                }

                // So sánh với tên enum (Approved, Rejected, Pending)
                if (field.Name.Equals(input, StringComparison.OrdinalIgnoreCase))
                {
                    return (T)field.GetValue(null)!;
                }
            }

            return null;
        }
    }
}
