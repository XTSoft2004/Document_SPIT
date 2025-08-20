namespace Domain.Common.Telegram.Interfaces
{
    public interface ITelegramServices
    {
        Task<bool> SendMessage(string message);
    }
}
