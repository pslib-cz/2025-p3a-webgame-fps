using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPS_TCG.Server.Controllers
{
    [ApiController]
    [Route("api/images")]
    //musi byt pripona příkad: blehcat.png nesmí to byt blehcat
    public class ImagesController : ControllerBase
    {
        [HttpGet("{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var imagePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Images",
                fileName
            );

            if (!System.IO.File.Exists(imagePath))
                return NotFound();

            var contentType = "image/png"; 
            return PhysicalFile(imagePath, contentType);
        }
    }
}
