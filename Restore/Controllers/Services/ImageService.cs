using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Restore.Controllers.Services
{
    public class ImageService
    {
        private readonly Cloudinary _cloudainay;

        public ImageService(IConfiguration config)
        {
            var acc = new Account
                (
                    config["Cloudinary:CloudName"],
                    config["Cloudinary:ApiKey"],
                    config["Cloudinary:ApiSecret"]
                );

            _cloudainay = new Cloudinary(acc);

        }

        public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if(file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream)

                };
                uploadResult = await _cloudainay.UploadAsync(uploadParams);
            }

            return uploadResult;


        }

        public async Task<DeletionResult> DeleteImageAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            var result = await _cloudainay.DestroyAsync(deleteParams);

            return result;
        }
    }
}
