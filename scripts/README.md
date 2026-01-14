# 图片检查脚本测试

## 测试说明

此目录包含用于测试外部图片检查脚本的测试文件。

## 运行测试

```bash
# 测试应该通过（合法的图片引用）
node scripts/check-external-images.mjs

# 创建包含非法图片的测试文件后，脚本应该报错
```

## 测试用例

### 合法的图片引用
- 本地图片：`![本地图片](/img/test.png)`
- 允许的外部域名：`![CDN](https://cdn.imoscarz.me/image.png)`

### 非法的图片引用（应该被检测到）
- 未授权的外部域名：`![非法](https://example.com/image.png)`
- HTTP 协议图片：`![HTTP](http://example.com/image.jpg)`
