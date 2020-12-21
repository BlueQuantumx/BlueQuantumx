# Polynomial

## 多项式乘法 NTT

### 前置知识

#### 原根

若存在 $g$ 使得 $g^{\varphi(p)} \equiv 1 \pmod p$，则 $g$ 为质数 $p$ 的原根

$n$ 次单位根 $w_n = g^{\frac {p-1} n}$

$w_n^{2i} = w_{\frac{n}{2}}^i$

$$
\begin{aligned}
f &= [A_0, A_1, A_2, \cdots, A_{n-1}] \\
f(w_n^i) &= A_0 + A_1w_n^i + A_2w_n^{i2} + \cdots + A_{n-1}w_n^{i(n-1)} \\
f_1 &= [A_0, A_2, A_4, \cdots, A_{n-2}] \\
f_2 &= [A_1, A_3, A_5, \cdots, A_{n-1}] \\
f(w_n^i) &= f_1(w_n^{i2}) + w_n^if_2(w_n^{i2}) \\
f(w_n^i) &= f_1(w_{\frac{n}{2}}^{i}) + w_n^if_2(w_{\frac{n}{2}}^{i})
\end{aligned}
$$

## 多项式乘法逆 Inv

倍增处理，假设已经求出 $\pmod {x^\frac{n}{2}}$ 意义下的逆元记为 $inv_0$

$$
\begin{aligned}
f * inv_0 &\equiv 1 \pmod {x^\frac{n}{2}} \\
f * inv &\equiv 1 \pmod {x^n} \\
f * (inv - inv_0) &\equiv 0 \pmod {x^\frac{n}{2}} \\
inv - inv_0 &\equiv 0 \pmod {x^\frac{n}{2}}
\end{aligned}
$$

因为 $inv - inv_0$ 最低系数不为零的项次数为 $x^\frac{n}{2}$ 平方后 最低系数不为零的项次数为 $x^n$ 所以

$$
\begin{aligned}
(inv - inv_0)^2 &\equiv 0 \pmod {x^n} \\
inv^2 + inv_0^2 - 2inv * inv_0 &\equiv 0 \pmod {x^n}
\end{aligned}
$$

两边同时乘 $f$

$$
\begin{aligned}
inv + inv_0^2*f - 2inv_0 &\equiv 0 \pmod {x^n} \\
inv &\equiv 2inv_0 - inv_0^2*f \pmod {x^n}
\end{aligned}
$$

## 多项式对数函数 Ln

先微分再积分

$$
g' = (\ln f)' = \frac{f'}{f}
$$

## 多项式指数函数 Exp

$$
g = e^f \\
$$

设 $h(g) = \ln g - f$ 其中 $g$ 为多项式

求 $h(g) \equiv 0 \pmod {x^n}$ 的根，考虑牛顿迭代法

假设已经求出 $h(g_0) \equiv 0 \pmod {x^\frac{n}{2}}$

$$
h(g) = h(g_0) + \frac{h'(g_0)}{1!}(g-g_0) + \frac{h''(g_0)}{2!}(g-g_0)^2 + \cdots
$$

因为 $g - g_0$ 最低系数不为零的项次数为 $x^\frac{n}{2}$ 平方后 最低系数不为零的项次数为 $x^n$ 所以

$$
\begin{aligned}
h(g) &\equiv h(g_0) + h'(g_0) * (g-g_0) \pmod {x^n} \\
0 &\equiv h(g_0) + h'(g_0) * (g-g_0) \pmod {x^n} \\
g &\equiv g_0 - \frac{h(g_0)}{h'(g_0)} \pmod {x^n} \\
g &\equiv g_0 - g_0 * (\ln g_0 - f) \pmod {x^n} \\
g &\equiv g_0 * (f - \ln g_0 + 1) \pmod {x^n}
\end{aligned}
$$

<button id="Polynomialbtn" onclick="showCode('Polynomial')">展开代码</button>
<div id="Polynomial" class="code" style="height: 0px;">

```cpp
/// @tags: NTT Polynomial
#include <algorithm>
#include <cctype>
#include <cstdio>
#include <cstring>

typedef long long ll;

const int N = 1 << 18, mod = 998244353, G = 3, invG = 332748118;

template <typename T>
inline T &read(T &x) {
  x = 0;
  bool f = false;
  short ch = getchar();
  while (!isdigit(ch)) {
    if (ch == '-') f = true;
    ch = getchar();
  }
  while (isdigit(ch)) x = x * 10 + (ch ^ '0'), ch = getchar();
  if (f) x = -x;
  return x;
}

class Polynomial {
 private:
  int f[N];
  static int Cvt[N << 2];

 public:
  void NTT(const bool typ, const int n);
  void inv(Polynomial &res, const int n) const;
  void ln(Polynomial &res, const int n) const;
  void exp(Polynomial &res, const int n) const;
  int &operator[](int index) { return f[index]; };
  const int &operator[](int index) const { return f[index]; };
  inline void pre(int n) {
    for (int i = 1, len = 2; len <= n; ++i, len <<= 1)
      for (int j = 1, *const cvt = Cvt + len - 1; j < len; ++j)
        cvt[j] = cvt[j >> 1] >> 1 | ((j & 1) << (i - 1));
  }
  inline void clear(int n) {
    int maxl = 1;
    while (maxl < n) maxl <<= 1;
    memset(f, 0, sizeof(int) * maxl);
  }
} f, g;

int n;
int Polynomial::Cvt[N << 2];

inline ll qpow(ll base, int exp) {
  ll res = 1;
  while (exp) {
    if (exp & 1) res = res * base % mod;
    base = base * base % mod;
    exp >>= 1;
  }
  return res;
}

inline void Polynomial::NTT(const bool typ, const int n) {
  for (int i = 1, *const cvt = Cvt + n - 1; i < n; ++i)
    if (i < cvt[i]) std::swap(f[i], f[cvt[i]]);
  for (int i = 2; i <= n; i <<= 1) {
    int mid = i >> 1, wn = qpow(typ ? G : invG, (mod - 1) / i);
    for (int j = 0; j < n; j += i) {
      ll wk = 1;
      for (int k = 0; k < mid; ++k, (wk *= wn) %= mod) {
        ll t = wk * f[j + k + mid] % mod;
        if ((f[j + k + mid] = f[j + k] - t) < 0) f[j + k + mid] += mod;
        if ((f[j + k] += t) >= mod) f[j + k] -= mod;
      }
    }
  }
  if (!typ) {
    ll inv = qpow(n, mod - 2);
    for (int i = 0; i < n; ++i) f[i] = inv * f[i] % mod;
  }
}

inline void Polynomial::inv(Polynomial &res, const int n) const {
  static Polynomial tmp;
  if (n == 1) return res[0] = qpow(f[0], mod - 2), void();
  inv(res, (n + 1) >> 1);
  int maxl = 1;
  while (maxl < n << 1) maxl <<= 1;
  tmp.clear(n << 1);
  memcpy(tmp.f, f, sizeof(int) * n);
  tmp.NTT(true, maxl), res.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i)
    res[i] = static_cast<ll>(res[i]) *
             ((2ll - static_cast<ll>(res[i]) * tmp[i] % mod + mod) % mod) % mod;
  res.NTT(false, maxl);
  for (int i = n; i < maxl; ++i) res[i] = 0;
}

inline void Polynomial::ln(Polynomial &res, const int n) const {
  static Polynomial df, invf;
  df.clear(n << 1), invf.clear(n << 1);
  int maxl = 1;
  while (maxl < n << 1) maxl <<= 1;
  for (int i = 0; i + 1 < n; ++i) df[i] = static_cast<ll>(f[i + 1]) * (i + 1) % mod;
  inv(invf, n);
  invf.NTT(true, maxl), df.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i) res[i] = static_cast<ll>(df[i]) * invf[i] % mod;
  res.NTT(false, maxl);
  for (int i = n - 1; i; --i)
    res[i] = static_cast<ll>(res[i - 1]) * qpow(i, mod - 2) % mod;
  res[0] = 0;
}

inline void Polynomial::exp(Polynomial &res, const int n) const {
  static Polynomial lnres;
  if (n == 1) { return res[0] = 1, void(); }
  exp(res, (n + 1) >> 1);
  res.ln(lnres, n);
  int maxl = 1;
  while (maxl < n << 1) maxl <<= 1;
  for (int i = 0; i < n; ++i)
    if ((lnres[i] = f[i] - lnres[i]) < 0) lnres[i] += mod;
  ++lnres[0];
  if (lnres[0] >= mod) lnres[0] -= mod;
  lnres.NTT(true, maxl), res.NTT(true, maxl);
  for (int i = 0; i < maxl; ++i) res[i] = static_cast<ll>(res[i]) * lnres[i] % mod;
  res.NTT(false, maxl);
  for (int i = n; i < maxl; ++i) res[i] = 0;
}

int main() {
#ifndef ONLINE_JUDGE
#ifdef LOCAL
  freopen64("/tmp/CodeTmp/testdata.in", "r", stdin);
  freopen64("/tmp/CodeTmp/testdata.out", "w", stdout);
#else
  freopen("PolyExp.in", "r", stdin);
  freopen("PolyExp.out", "w", stdout);
#endif
#endif

  read(n);
  for (int i = 0; i < n; ++i) read(f[i]);
  f.pre(n << 2);
  f.exp(g, n);
  for (int i = 0; i < n; ++i) printf("%d ", g[i]);
  return 0;
}
```

</div>