---
title: Windows安装Docker
description: Windows安装Docker
date: 2022-10-29
category:
  - Windows
  - Docker
tag:
  - Docker
---

<!-- more -->

## 一、Windows 安装Docker

### 1.下载Docker Desktop

[Docker Desktop 官网](https://www.docker.com/products/docker-desktop/)

### 2.安装WSL
```sh
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

### 3.启用虚拟机功能
```sh
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### 4.下载 Linux 内核更新包

[适用于 x64 计算机的 WSL2 Linux 内核更新包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

### 5.将 WSL 2 设置为默认版本
```sh
wsl --set-default-version 2
```

**PS：参考文档**

[WSL 的手动安装步骤](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)