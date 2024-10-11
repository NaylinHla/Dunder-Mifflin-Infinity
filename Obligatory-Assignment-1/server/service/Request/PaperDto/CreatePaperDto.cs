namespace service.Request;

public class CreatePaperDto
{
    public string name { get; set; } = null!;
    public int stock { get; set; }
    public double price { get; set; }
}